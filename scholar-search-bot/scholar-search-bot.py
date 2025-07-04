import praw
import time
from dotenv import load_dotenv
import os
import logging
import threading

# --- Feature Toggles ---
ENABLE_SUBMISSION_REPLIES = True
ENABLE_COMMENT_REPLIES = True  # set to True when ready to monitor comments

# --- Load Environment Variables ---
load_dotenv()

# --- Get Directory of This Script ---
script_dir = os.path.dirname(os.path.abspath(__file__))

# --- Set Log File and Replied File Paths ---
log_filename = os.path.join(script_dir, "bot.log")
replied_file_path = os.path.join(script_dir, "replied.txt")

# --- Configure Logging ---
logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# --- Reddit Bot Credentials ---
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    username=os.getenv("REDDIT_USERNAME"),
    password=os.getenv("REDDIT_PASSWORD"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

# --- Confirm Login ---
try:
    user = reddit.user.me()
    print(f"✅ Logged in as: u/{user}")
    logging.info(f"Logged in as u/{user}")
except Exception as e:
    print("❌ Failed to log in:", e)
    logging.error(f"Login failed: {e}")
    exit(1)

# --- Subreddits to Monitor ---
subreddit_list = [
    # "scholarships",
    # "ApplyingToCollege",
    # "college",
    # "financialaid",
    # "Questbridge",
    # "chanceme",
    "testScholarSearch"
]
subreddits = reddit.subreddit("+".join(subreddit_list))

# --- Load Already Replied Post IDs ---
if os.path.exists(replied_file_path):
    with open(replied_file_path, "r") as f:
        replied_to = set(line.strip() for line in f.readlines())
else:
    replied_to = set()

# --- Bot Reply Message ---
message = (
    "If you're still searching for scholarships, fly-in programs, or pre-college opportunities, "
    "try [Scholar Search](https://scholar-search.com) — it's a free tool designed to help students find real programs without the spam."
)

# --- Trigger Keywords ---
trigger_keywords = [
    "scholarship", "scholarships", "financial aid", "pay for college", "tuition",
    "fly-in", "fly in", "diversity visit", "diversity fly in", "flyin",
    "pre-college", "precollege", "summer program", "hs program"
]

# --- Helper Function to Check Text for Keywords ---
def matches_trigger(text):
    return any(keyword in text.lower() for keyword in trigger_keywords)

# --- Handle Submissions ---
def monitor_submissions():
    while True:
        try:
            for submission in subreddits.new(limit=10):
                if submission.id not in replied_to and matches_trigger(submission.title):
                    submission.reply(message)
                    log_entry = f"[Post] Replied to u/{submission.author} in r/{submission.subreddit} — {submission.title}"
                    print(f"✅ {log_entry}")
                    logging.info(log_entry)

                    replied_to.add(submission.id)
                    with open(replied_file_path, "a") as f:
                        f.write(submission.id + "\n")
                    time.sleep(600)  # wait between replies
            time.sleep(60)
        except Exception as e:
            logging.error(f"[Post Error] {e}")
            time.sleep(60)

# --- Handle Comments ---
def monitor_comments():
    while True:
        try:
            for comment in subreddits.stream.comments(skip_existing=True):
                if comment.id not in replied_to and matches_trigger(comment.body):
                    comment.reply(message)
                    log_entry = f"[Comment] Replied to u/{comment.author} in r/{comment.subreddit} — {comment.body[:80]}"
                    print(f"✅ {log_entry}")
                    logging.info(log_entry)

                    replied_to.add(comment.id)
                    with open(replied_file_path, "a") as f:
                        f.write(comment.id + "\n")
                    time.sleep(600)
        except Exception as e:
            logging.error(f"[Comment Error] {e}")
            time.sleep(60)

# --- Run Enabled Monitors in Parallel Threads ---
if ENABLE_SUBMISSION_REPLIES:
    threading.Thread(target=monitor_submissions, daemon=True).start()

if ENABLE_COMMENT_REPLIES:
    threading.Thread(target=monitor_comments, daemon=True).start()

# --- Keep Main Thread Alive ---
while True:
    time.sleep(3600)
