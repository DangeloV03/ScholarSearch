"""
ScholarSearch Streamlit App - Phase 2
A web interface for the ScholarSearch agent using Streamlit.
"""

import streamlit as st
import os
from dotenv import load_dotenv
from scholar_agent import initialize_agent

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="ScholarSearch",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

def main():
    """Main Streamlit application."""
    
    # Sidebar
    with st.sidebar:
        st.title("🎓 ScholarSearch")
        st.markdown("---")
        
        # Example queries
        st.subheader("💡 Example Queries")
        example_queries = [
            "Find STEM scholarships for Ohio high school students",
            "Engineering scholarships for women in computer science",
            "First-generation college student scholarships in Texas",
            "National Merit Scholarship requirements and deadlines",
            "Pre-college summer programs for high school students"
        ]
        
        for query in example_queries:
            if st.button(query, key=f"example_{query[:20]}"):
                st.session_state.example_query = query
                st.rerun()
        
        st.markdown("---")
        
        # Settings
        st.subheader("⚙️ Settings")
        enable_memory = st.checkbox("Enable conversation memory", value=True, 
                                  help="Remember previous queries for context")
        
        st.markdown("---")
        
        # Info
        st.subheader("ℹ️ About")
        st.markdown("""
        **ScholarSearch** uses AI to help you find scholarships and educational opportunities.
        
        **Features:**
        - 🔍 AI-powered search
        - 💬 Conversation memory
        - 📋 Detailed results
        - 🎯 Scholarship-focused
        
        **Powered by:**
        - Google Gemini AI
        - Tavily Search
        - LangChain
        """)
    
    st.title("🎓 ScholarSearch")
    st.markdown("Find scholarships and educational opportunities with AI-powered search.")
    
    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "thread_id" not in st.session_state:
        st.session_state.thread_id = "streamlit_session"
    
    # Initialize the agent (with error handling)
    try:
        agent = initialize_agent(use_memory=enable_memory)
        st.success("✅ Agent initialized successfully!")
    except Exception as e:
        st.error(f"❌ Failed to initialize agent: {e}")
        st.info("Please check your API keys in the .env file")
        return

    # Search interface
    st.markdown("---")
    st.subheader("🔍 Search for Scholarships")
    
    # Pre-fill query if example was clicked
    default_query = st.session_state.get("example_query", "")
    if default_query:
        del st.session_state.example_query
    
    # Text input for search query
    query = st.text_input(
        "Enter your scholarship search query:",
        value=default_query,
        placeholder="e.g., Find STEM scholarships for Ohio high school students",
        help="Describe the type of scholarships you're looking for"
    )
    
    # Search button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        search_button = st.button("🔍 Search", type="primary", use_container_width=True)
    
    # Response area
    st.markdown("---")
    st.subheader("📋 Results")
    
    if search_button and query:
        with st.spinner("Searching for scholarships..."):
            try:
                response = agent.search_scholarships(query, st.session_state.thread_id)
                
                # Add to conversation history
                st.session_state.messages.append({"role": "user", "content": query})
                st.session_state.messages.append({"role": "assistant", "content": response})
                
                st.markdown("### Response:")
                st.write(response)
            except Exception as e:
                st.error(f"❌ Search failed: {e}")
    elif search_button and not query:
        st.warning("⚠️ Please enter a search query first.")
    else:
        st.info("💡 Enter a search query above and click 'Search' to get started.")
    
    # Conversation history
    if st.session_state.messages:
        st.markdown("---")
        st.subheader("💬 Conversation History")
        
        # Clear conversation button
        if st.button("🗑️ Clear Conversation", type="secondary"):
            st.session_state.messages = []
            st.rerun()
        
        # Display conversation history
        for i, message in enumerate(st.session_state.messages):
            if message["role"] == "user":
                with st.chat_message("user"):
                    st.write(message["content"])
            else:
                with st.chat_message("assistant"):
                    st.write(message["content"])

if __name__ == "__main__":
    main() 