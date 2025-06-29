"""
Example usage of ScholarSearch Agent - Phase 1
Demonstrates various ways to use the agent for scholarship searches.
"""

import os
from dotenv import load_dotenv
from scholar_agent import initialize_agent

# Load environment variables
load_dotenv()

def example_basic_search():
    """Example 1: Basic scholarship search"""
    print("=" * 50)
    print("Example 1: Basic Scholarship Search")
    print("=" * 50)
    
    agent = initialize_agent()
    query = "Find STEM scholarships for Ohio high school students"
    
    print(f"Query: {query}")
    print("\nSearching...")
    
    response = agent.search_scholarships(query)
    print(f"\nResponse:\n{response}")

def example_streaming_search():
    """Example 2: Streaming search results"""
    print("\n" + "=" * 50)
    print("Example 2: Streaming Search Results")
    print("=" * 50)
    
    agent = initialize_agent()
    query = "Engineering scholarships for women in computer science"
    
    print(f"Query: {query}")
    print("\nStreaming results...")
    
    for i, step in enumerate(agent.stream_search(query)):
        print(f"\nStep {i+1}:")
        for message in step["messages"]:
            if message["role"] == "assistant":
                content = message["content"]
                if isinstance(content, str):
                    print(f"AI: {content[:100]}...")
                else:
                    print(f"AI: {content}")

def example_conversation_memory():
    """Example 3: Conversation with memory"""
    print("\n" + "=" * 50)
    print("Example 3: Conversation with Memory")
    print("=" * 50)
    
    agent = initialize_agent(use_memory=True)
    thread_id = "example_conversation_123"
    
    # First query
    query1 = "I'm a high school senior from California"
    print(f"User: {query1}")
    response1 = agent.search_scholarships(query1, thread_id)
    print(f"AI: {response1[:150]}...")
    
    # Follow-up query (should remember context)
    query2 = "What scholarships am I eligible for?"
    print(f"\nUser: {query2}")
    response2 = agent.search_scholarships(query2, thread_id)
    print(f"AI: {response2[:150]}...")

def example_specific_scholarship_search():
    """Example 4: Specific scholarship search"""
    print("\n" + "=" * 50)
    print("Example 4: Specific Scholarship Search")
    print("=" * 50)
    
    agent = initialize_agent()
    query = "National Merit Scholarship requirements and deadlines"
    
    print(f"Query: {query}")
    print("\nSearching...")
    
    response = agent.search_scholarships(query)
    print(f"\nResponse:\n{response}")

def main():
    """Run all examples"""
    print("ScholarSearch Agent - Example Usage")
    print("Make sure you have set GOOGLE_API_KEY and TAVILY_API_KEY in your .env file")
    
    try:
        # Check if environment variables are set
        if not os.getenv("GOOGLE_API_KEY") or not os.getenv("TAVILY_API_KEY"):
            print("\n❌ Error: Missing API keys!")
            print("Please set GOOGLE_API_KEY and TAVILY_API_KEY in your .env file")
            return
        
        # Run examples
        example_basic_search()
        example_streaming_search()
        example_conversation_memory()
        example_specific_scholarship_search()
        
        print("\n" + "=" * 50)
        print("All examples completed successfully!")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        print("Make sure all dependencies are installed and API keys are set correctly.")

if __name__ == "__main__":
    main() 