"""
ScholarSearch Agent - AI-powered scholarship search agent
A LangChain-based scholarship search agent using Gemini API and Tavily search.
"""

import os
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import LangChain components
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_tavily import TavilySearch
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# System prompt for scholarship search
SCHOLARSHIP_SYSTEM_PROMPT = """You are ScholarSearch, an expert AI assistant specializing in finding and providing detailed information about scholarships for students. Your role is to help students find relevant scholarship opportunities with specific, actionable information.

IMPORTANT GUIDELINES:
1. ALWAYS provide specific scholarship names, amounts, and deadlines when available
2. Include real scholarship programs with actual dollar amounts
3. Provide application requirements and eligibility criteria
4. Include direct links to scholarship applications when possible
5. Organize information clearly with categories and bullet points
6. Be encouraging and supportive while providing practical advice

WHEN SEARCHING FOR SCHOLARSHIPS:
- Use the search tool to find current, up-to-date scholarship information
- Focus on scholarships that match the student's specific criteria (major, GPA, location, etc.)
- Include both merit-based and need-based scholarships
- Mention application deadlines and requirements
- Provide tips for successful applications

RESPONSE FORMAT:
- Start with a brief summary of what you found
- List specific scholarships with: Name, Amount, Deadline, Requirements
- Include application tips and strategies
- End with encouragement and next steps

Remember: Students are counting on you to provide accurate, specific information that can help them fund their education. Always be thorough and provide actionable details."""

class ScholarSearchAgent:
    """Main agent class for scholarship search functionality."""
    
    def __init__(self, use_memory: bool = True):
        """
        Initialize the ScholarSearch agent.
        
        Args:
            use_memory (bool): Whether to enable conversation memory
        """
        self.model = self._initialize_gemini_model()
        self.search_tool = self._initialize_search_tool()
        self.tools = [self.search_tool]
        self.memory = MemorySaver() if use_memory else None
        self.agent_executor = self._create_agent()
    
    def _initialize_gemini_model(self) -> ChatGoogleGenerativeAI:
        """Initialize the Gemini LLM model."""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=api_key,
            temperature=0.1,
            max_tokens=2048
        )
    
    def _initialize_search_tool(self) -> TavilySearch:
        """Initialize the Tavily search tool."""
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY environment variable is required")
        
        return TavilySearch(
            max_results=5,
            search_depth="advanced",
            include_domains=["scholarships.com", "fastweb.com", "collegeboard.org", 
                           "bigfuture.collegeboard.org", "usnews.com", "princetonreview.com",
                           "scholarshipamerica.org", "collegescholarships.org", "scholarships360.org"]
        )
    
    def _create_agent(self):
        """Create the agent executor with tools and optional memory."""
        if self.memory:
            return create_react_agent(
                self.model, 
                self.tools, 
                checkpointer=self.memory
            )
        else:
            return create_react_agent(self.model, self.tools)
    
    def search_scholarships(self, query: str, thread_id: str = None) -> str:
        """
        Search for scholarships based on the given query.
        
        Args:
            query (str): The search query for scholarships
            thread_id (str): Optional thread ID for conversation memory
            
        Returns:
            str: The agent's response with scholarship information
        """
        # Create the initial message with system prompt
        system_message = {"role": "system", "content": SCHOLARSHIP_SYSTEM_PROMPT}
        user_message = {"role": "user", "content": query}
        
        # Always provide a thread_id if memory is enabled
        if self.memory:
            if not thread_id:
                thread_id = "default"
            config = {"configurable": {"thread_id": thread_id}}
            response = self.agent_executor.invoke(
                {"messages": [system_message, user_message]}, 
                config
            )
        else:
            response = self.agent_executor.invoke({"messages": [system_message, user_message]})
        
        # Find the last AI/assistant message with non-empty content
        last_content = None
        for message in response["messages"]:
            if (
                (hasattr(message, 'type') and message.type == "ai" and getattr(message, 'content', None))
                or (hasattr(message, 'role') and message.role == "assistant" and getattr(message, 'content', None))
                or (isinstance(message, dict) and message.get("role") == "assistant" and message.get("content"))
            ):
                last_content = message.content if hasattr(message, 'content') else message["content"]
        return last_content or "No response generated."
    
    def stream_search(self, query: str, thread_id: str = None):
        """
        Stream the scholarship search process.
        
        Args:
            query (str): The search query for scholarships
            thread_id (str): Optional thread ID for conversation memory
            
        Yields:
            dict: Streaming response steps
        """
        # Create the initial message with system prompt
        system_message = {"role": "system", "content": SCHOLARSHIP_SYSTEM_PROMPT}
        user_message = {"role": "user", "content": query}
        
        # Always provide a thread_id if memory is enabled
        if self.memory:
            if not thread_id:
                thread_id = "default"
            config = {"configurable": {"thread_id": thread_id}}
            for step in self.agent_executor.stream(
                {"messages": [system_message, user_message]}, 
                config, 
                stream_mode="values"
            ):
                yield step
        else:
            for step in self.agent_executor.stream(
                {"messages": [system_message, user_message]}, 
                stream_mode="values"
            ):
                yield step

def initialize_agent(use_memory: bool = True) -> ScholarSearchAgent:
    """
    Initialize and return a ScholarSearch agent instance.
    
    Args:
        use_memory (bool): Whether to enable conversation memory
        
    Returns:
        ScholarSearchAgent: Configured agent instance
    """
    return ScholarSearchAgent(use_memory=use_memory)

def main():
    """Simple CLI interface for testing the agent."""
    print("ScholarSearch Agent - AI-Powered Scholarship Search")
    print("=" * 50)
    
    try:
        agent = initialize_agent()
        print("Agent initialized successfully!")
        
        while True:
            query = input("\nEnter your scholarship search query (or 'quit' to exit): ")
            if query.lower() in ['quit', 'exit', 'q']:
                break
            
            print("\nSearching for scholarships...")
            response = agent.search_scholarships(query)
            print(f"\nResponse:\n{response}")
            
    except Exception as e:
        print(f"Error: {e}")
        print("\nMake sure you have set the following environment variables:")
        print("- GOOGLE_API_KEY: Your Google Gemini API key")
        print("- TAVILY_API_KEY: Your Tavily search API key")

if __name__ == "__main__":
    main() 