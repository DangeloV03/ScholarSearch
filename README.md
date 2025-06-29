# ScholarSearch Agent - Phase 1

A LangChain-based scholarship search agent using Gemini API and Tavily search.

## Quick Start

### Option 1: Automated Setup
```bash
python setup.py
```

### Option 2: Manual Setup

#### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2. Set Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Tavily Search API Key  
# Get your API key from: https://tavily.com/
TAVILY_API_KEY=your_tavily_api_key_here
```

#### 3. Run Tests

```bash
python test_agent.py
```

#### 4. Use the Agent

##### Interactive CLI
```bash
python scholar_agent.py
```

##### Programmatic Usage
```python
from scholar_agent import initialize_agent

# Initialize agent
agent = initialize_agent()

# Search for scholarships
response = agent.search_scholarships("Find STEM scholarships for Ohio high school students")
print(response)

# Stream search results
for step in agent.stream_search("Engineering scholarships for women"):
    print(step)
```

##### Run Examples
```bash
python example_usage.py
```

## Features

- **Gemini LLM Integration**: Uses Google's Gemini 1.5 Flash model
- **Tavily Search**: Advanced web search with scholarship-focused domains
- **Conversation Memory**: Optional memory for multi-turn conversations
- **Streaming Support**: Real-time streaming of search results
- **Error Handling**: Comprehensive error handling and validation

## Project Structure

```
ScholarSearch/
├── scholar_agent.py      # Main agent implementation
├── test_agent.py         # CLI test script
├── example_usage.py      # Example usage demonstrations
├── setup.py             # Automated setup script
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── .env                 # Environment variables (create this)
```

## Phase 1 Deliverables

✅ `scholar_agent.py` with:
- Gemini LLM initialization
- Web search tool integration (Tavily)
- Basic agent executor

✅ `requirements.txt` with dependencies

✅ Simple CLI test script

## API Keys Required

1. **Google Gemini API Key**: 
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Add to `.env` as `GOOGLE_API_KEY`

2. **Tavily Search API Key**:
   - Visit: https://tavily.com/
   - Sign up for a free account
   - Get your API key
   - Add to `.env` as `TAVILY_API_KEY`

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
python test_agent.py

# Test specific functionality
python -c "
from scholar_agent import initialize_agent
agent = initialize_agent()
response = agent.search_scholarships('STEM scholarships')
print(response)
"
```

## Next Steps

Phase 2 will add:
- Streamlit UI with search input
- Response display area
- Session state management
- Loading states and error handling

## Troubleshooting

1. **Missing API Keys**: Make sure both `GOOGLE_API_KEY` and `TAVILY_API_KEY` are set in your `.env` file
2. **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
3. **Network Issues**: Check your internet connection and API key validity
4. **Python Version**: Requires Python 3.8 or higher

## Contributing

This is Phase 1 of the ScholarSearch project. The agent is designed to be extensible for future phases including:
- Enhanced search tools
- Web UI development
- API endpoints
- Production deployment # ScholarSearch
