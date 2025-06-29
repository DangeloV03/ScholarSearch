#!/usr/bin/env python3
"""
Setup script for ScholarSearch Agent - Phase 1
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    print("\n🔧 Creating .env file...")
    env_content = """# ScholarSearch Agent - Environment Variables
# Replace with your actual API keys

# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Tavily Search API Key  
# Get your API key from: https://tavily.com/
TAVILY_API_KEY=your_tavily_api_key_here
"""
    
    try:
        with open(env_file, "w") as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️  Please edit .env file and add your actual API keys")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def run_tests():
    """Run the test suite"""
    print("\n🧪 Running tests...")
    try:
        result = subprocess.run([sys.executable, "test_agent.py"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Tests passed")
            return True
        else:
            print("❌ Tests failed")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def main():
    """Main setup function"""
    print("ScholarSearch Agent - Phase 1 Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create .env file
    if not create_env_file():
        sys.exit(1)
    
    # Run tests (will fail if API keys not set, but that's expected)
    print("\n📝 Next steps:")
    print("1. Edit .env file and add your API keys")
    print("2. Run: python test_agent.py")
    print("3. Run: python scholar_agent.py")
    print("4. Run: python example_usage.py")
    
    print("\n🎉 Setup completed!")
    print("Please add your API keys to the .env file before running the agent.")

if __name__ == "__main__":
    main() 