"""
Simple CLI test script for ScholarSearch Agent - Phase 1
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_agent_response():
    """Test 1: Verify agent returns scholarship info"""
    try:
        from scholar_agent import initialize_agent
        
        print("Initializing agent...")
        agent = initialize_agent()
        
        print("Testing scholarship search...")
        response = agent.search_scholarships("Find STEM scholarships for Ohio high school students")
        
        print(f"Response received: {len(response)} characters")
        print(f"Response preview: {response[:200]}...")
        
        # Check if response contains expected keywords
        response_lower = response.lower()
        assert "scholarship" in response_lower, "Response should contain 'scholarship'"
        assert "ohio" in response_lower, "Response should contain 'ohio'"
        
        print("✅ Test 1 PASSED: Agent returns scholarship info")
        return True
        
    except Exception as e:
        print(f"❌ Test 1 FAILED: {e}")
        return False

def test_agent_initialization():
    """Test 2: Verify agent can be initialized"""
    try:
        from scholar_agent import initialize_agent
        
        print("Testing agent initialization...")
        agent = initialize_agent()
        
        assert agent is not None, "Agent should be initialized"
        assert hasattr(agent, 'search_scholarships'), "Agent should have search_scholarships method"
        assert hasattr(agent, 'stream_search'), "Agent should have stream_search method"
        
        print("✅ Test 2 PASSED: Agent can be initialized")
        return True
        
    except Exception as e:
        print(f"❌ Test 2 FAILED: {e}")
        return False

def test_environment_variables():
    """Test 3: Verify required environment variables are set"""
    required_vars = ["GOOGLE_API_KEY", "TAVILY_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Test 3 FAILED: Missing environment variables: {missing_vars}")
        print("Please set the following environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        return False
    else:
        print("✅ Test 3 PASSED: All required environment variables are set")
        return True

def main():
    """Run all tests"""
    print("ScholarSearch Agent - Phase 1 Tests")
    print("=" * 40)
    
    tests = [
        test_environment_variables,
        test_agent_initialization,
        test_agent_response
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        print(f"\nRunning {test.__name__}...")
        if test():
            passed += 1
        print("-" * 40)
    
    print(f"\nTest Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Phase 1 is ready.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 