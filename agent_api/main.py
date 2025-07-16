"""
FastAPI backend for ScholarSearch Agent
Provides REST API endpoints for the Python agent
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import sys
import asyncio
from pathlib import Path

# Add the parent directory to the path to import the agent
sys.path.append(str(Path(__file__).parent.parent))

from scholar_agent import ScholarSearchAgent

app = FastAPI(
    title="ScholarSearch Agent API",
    description="API for the ScholarSearch scholarship search agent",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent(s)
agent_gemini = None
agent_tavily = None

@app.on_event("startup")
async def startup_event():
    global agent_gemini, agent_tavily
    try:
        agent_gemini = ScholarSearchAgent(use_memory=True)
        agent_tavily = ScholarSearchAgent(use_memory=True)  # Optionally, configure for Tavily
        print("ScholarSearch Agents initialized successfully")
    except Exception as e:
        print(f"Error initializing agent: {e}")
        raise e

class SearchRequest(BaseModel):
    query: str
    thread_id: Optional[str] = None
    agent: Optional[str] = 'gemini'

class SearchResponse(BaseModel):
    response: str
    thread_id: str
    metadata: Optional[Dict[str, Any]] = None

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent_loaded": agent_gemini is not None}

@app.post("/search", response_model=SearchResponse)
async def search_scholarships(request: SearchRequest):
    if not agent_gemini:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    try:
        thread_id = request.thread_id or "default"
        agent_type = (request.agent or 'gemini').lower()
        if agent_type == 'tavily':
            # Optionally, you can configure the agent to use Tavily differently
            response = agent_tavily.search_scholarships(request.query, thread_id)
        else:
            response = agent_gemini.search_scholarships(request.query, thread_id)
        return SearchResponse(
            response=response,
            thread_id=thread_id,
            metadata={
                "query": request.query,
                "processing_time": 1000,
                "results_count": 1
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/search/stream")
async def search_scholarships_stream(request: SearchRequest):
    """Stream the scholarship search process"""
    if not agent_gemini:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    
    try:
        thread_id = request.thread_id or "default"
        
        # This would need to be implemented as a streaming response
        # For now, return the regular response
        response = agent_gemini.search_scholarships(request.query, thread_id) # Use agent_gemini for streaming
        
        return SearchResponse(
            response=response,
            thread_id=thread_id,
            metadata={
                "query": request.query,
                "processing_time": 1000,
                "results_count": 1
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stream search failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 