# ScholarSearch - AI-Powered Scholarship Search Platform

A modern, full-stack web application that helps students find scholarships using AI-powered search and conversation interfaces.

## 🚀 Features

- **AI-Powered Search**: Uses Gemini and Tavily agents to find relevant scholarships
- **Conversation Interface**: ChatGPT-style chat interface with conversation persistence
- **User Authentication**: Secure authentication with Supabase Auth
- **Real-time Chat**: Live conversation with contextual memory
- **Smart Titles**: Auto-generates contextual conversation titles
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🏗️ Architecture

```
Frontend (Next.js 14) ←→ API Routes ←→ Supabase Database
                ↓
            FastAPI Backend ←→ Python ScholarSearch Agent
```

## 📁 Project Structure

```
ScholarSearch/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main dashboard
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── chat/             # Chat interface components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── supabaseClient.ts # Supabase client
│   ├── supabaseServer.ts # Supabase server client
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── agent_api/            # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── database_schema.sql   # Database schema
└── README.md            # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **FastAPI** - Python web framework
- **LangChain** - AI/LLM framework
- **Google Gemini** - AI model
- **Tavily** - Search API

### Database & Auth
- **Supabase** - PostgreSQL database with auth
- **Row Level Security** - Data security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Supabase account
- Google Gemini API key
- Tavily API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd ScholarSearch
npm install
```

### 2. Environment Setup

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs
GOOGLE_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key

# Backend
AGENT_API_URL=http://localhost:8000
```

### 3. Database Setup

Run the database schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database_schema.sql
```

### 4. Start the Backend

```bash
cd agent_api
pip install -r requirements.txt
python main.py
```

### 5. Start the Frontend

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### API Endpoints

#### Frontend API Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `GET /api/conversations/[id]/messages` - Get conversation messages
- `POST /api/conversations/[id]/messages` - Add message
- `POST /api/search` - Search for scholarships

#### Backend API Routes
- `POST /search` - AI scholarship search
- `GET /health` - Health check

## 🎨 UI Components

### Chat Interface
- **ChatInterface** - Main chat container
- **ConversationSidebar** - Conversation list
- **ChatArea** - Message display area
- **MessageBubble** - Individual message component
- **MessageInput** - Message input with agent toggle

### Authentication
- **LoginForm** - User login
- **RegisterForm** - User registration
- **AuthGuard** - Route protection

## 🔒 Security

- **Row Level Security** - Database-level security
- **Authentication** - Supabase Auth integration
- **API Protection** - Server-side authentication checks
- **Environment Variables** - Secure configuration

## 🚀 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically

### Backend (Railway/Render)
1. Deploy `agent_api/` directory
2. Set environment variables
3. Update `AGENT_API_URL` in frontend

### Database
- Supabase handles database hosting
- Automatic backups and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.
