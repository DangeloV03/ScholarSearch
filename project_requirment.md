
```prompt
# ScholarSearch Project Roadmap
Build a LangChain-based scholarship search agent using Gemini API and Streamlit, with future migration to Next.js. Break development into phases:

## Phase 1: Core Agent Setup
**Deliverables:**
1. `scholar_agent.py` with:
   - Gemini LLM initialization
   - Web search tool integration (Tavily)
   - Basic agent executor
2. `requirements.txt` with dependencies
3. Simple CLI test script

**Tests:**
```
# Test 1: Verify agent returns scholarship info
def test_agent_response():
    agent = initialize_agent()
    response = agent.run("Find STEM scholarships for Ohio high school students")
    assert "scholarship" in response.lower()
    assert "ohio" in response.lower()
```

## Phase 2: Streamlit Prototype
**Deliverables:**
1. `app.py` with:
   - Streamlit UI with search input
   - Response display area
   - Session state management
2. `.streamlit/secrets.toml` config
3. Loading states and error handling

**Tests:**
```
# Test 1: Verify UI components render
def test_ui_components():
    assert st.text_input("Search scholarships...") is not None
    assert st.button("Search") is not None

# Test 2: Verify API integration
def test_gemini_integration():
    response = get_gemini_response("Test prompt")
    assert isinstance(response, str)
    assert len(response) > 20
```

## Phase 3: Search Tool Specialization
**Deliverables:**
1. `tools.py` with:
   - Scholarship-specific search tool
   - Program/fly-in detection logic
   - Result filtering by grade level
2. Enhanced agent prompt template
3. Caching mechanism

**Tests:**
```
# Test 1: Verify scholarship detection
def test_scholarship_filter():
    results = search_tool("National Merit Scholarship")
    assert any("deadline" in r for r in results)

# Test 2: Verify pre-college program detection
def test_program_detection():
    results = search_tool("MIT summer program")
    assert any("pre-college" in r.lower() for r in results)
```

## Phase 4: Next.js Migration Prep
**Deliverables:**
1. `api/` directory with:
   - FastAPI backend endpoint (`/search`)
   - Agent invocation logic
   - CORS configuration
2. Next.js frontend stub with:
   - Search component
   - Results display
   - API connection

**Tests:**
```
# Test 1: Verify API endpoint
def test_api_endpoint():
    response = client.post("/search", json={"query": "engineering scholarships"})
    assert response.status_code == 200
    assert "programs" in response.json()

# Test 2: Verify frontend-backend integration
def test_frontend_integration():
    render()
    fireEvent.input(searchBox, "Fly-in programs")
    fireEvent.click(searchButton)
    assert resultsContainer.hasContent()
```

## Phase 5: Productionization
**Deliverables:**
1. Dockerfile for containerization
2. CI/CD pipeline config
3. Rate limiting
4. Monitoring hooks

**Tests:**
```
# Test 1: Verify container build
def test_docker_build():
    assert subprocess.run(["docker", "build", "."]).returncode == 0

# Test 2: Verify load handling
def test_load_handling():
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(send_query) for _ in range(50)]
    assert all(f.result().status == 200 for f in futures)
```

## Implementation Notes:
1. Use `langchain-google-genai` for Gemini integration
2. Prioritize:
   - DuckDuckGoSearchTool for initial web access
   - Tavily for higher-quality results (requires API key)
3. Add memory management in Phase 3 for conversation history
4. Implement result pagination in Phase 4
```

This prompt provides:
1. **Phased development** with clear milestones
2. **Test-driven approach** with verifiable criteria
3. **Migration path** from Streamlit to Next.js
4. **Specialized tooling** for scholarship discovery
5. **Production-readiness** considerations

To use with Cursor:
1. Create new project directory
2. Start with Phase 1 deliverables
3. Use `/test` command after each phase
4. Gradually expand functionality through phases
5. Use `/commit` at each phase completion

The structure allows Cursor to generate code incrementally while maintaining test coverage and clear progression toward your full-stack vision.