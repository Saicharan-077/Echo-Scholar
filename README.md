# 🎙️ EchoScholar AI — Research & Learning Operating System

> **Transform complex research papers into multi-speaker audio podcasts, interactive knowledge graphs, and adaptive quizzes. Learn faster with your Cognitive Twin AI workspace.**

![EchoScholar Dashboard](https://github.com/Saicharan-077/Echo-Scholar/assets/dashboard.png) *(Placeholder for dashboard image)*

---

## 🌟 Overview

EchoScholar AI is a comprehensive learning operating system designed for researchers, students, and academics. By simply uploading a PDF research paper, EchoScholar intelligently processes the content to provide a multi-modal learning experience:
- Listen to **dynamic AI-narrated podcasts** featuring a Professor and Student discussing the paper.
- Test your knowledge with **Adaptive Quizzes** grounded strictly in the academic text.
- Explore concepts visually through an **Interactive Knowledge Graph**.
- Ask questions and get answers via **RAG (Retrieval-Augmented Generation)**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **Smart PDF Ingestion** | Upload research papers (up to 50 MB). Text is cleaned, chunked, and indexed using FAISS for semantic search. |
| 🎧 **Dynamic Multi-Speaker Podcasts** | Converts papers into engaging dialogue (Host/Guest). Features intelligent duration scaling (5-min, 15-min, 30-min) and async batch processing for rapid generation. |
| 🧠 **Adaptive Quizzes** | Generates real-time, document-grounded multiple-choice questions. Uses strict filtering to remove PDF metadata/noise from options. |
| 🕸️ **Knowledge Graph** | Visualizes core entities and their relationships within a paper using React Flow. |
| 🤖 **Multi-LLM Engine Support** | Supports OpenAI, Groq, OpenRouter, and Featherless.ai for lightning-fast inference and RAG. |
| 🔐 **Authentication** | Secure JWT-based email/password login and Google OAuth integration. |

---

## 🏗️ Tech Stack

### Frontend (Vercel Ready)
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State & Data:** TanStack Query, React Router v6
- **Visuals:** Framer Motion, React Flow (Knowledge Graphs)

### Backend (Render Ready)
- **Framework:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL (via `asyncpg`) or SQLite (`aiosqlite`) + SQLAlchemy ORM
- **AI/LLM:** OpenAI, Groq, OpenRouter
- **TTS Engine:** ElevenLabs (Premium) with Edge TTS (Free, high-speed fallback)
- **Vector Search:** FAISS + PyMuPDF for document embedding

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js 18+** & npm
- **Python 3.10+**
- (Optional) PostgreSQL database

### 1. Setup the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your API keys (OpenAI, Groq, Google Client ID, etc.)

# Run database migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Backend runs on `http://localhost:8000` (Docs at `/docs`)*

### 2. Setup the Frontend
Open a new terminal tab:
```bash
cd frontend
npm install

# Set up environment variables
# Ensure VITE_API_URL=http://localhost:8000/api
cp .env.example .env

# Start the Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## ☁️ Deployment Guide

### Deploying the Frontend (Vercel)
EchoScholar's frontend is pre-configured for Vercel SPA deployment.
1. Push your code to GitHub.
2. In Vercel, import your repository.
3. Set the **Root Directory** to `frontend` or `./` (a root `vercel.json` and `package.json` handles the redirect).
4. Add Environment Variables:
   - `VITE_BACKEND_URL`: Your live backend URL.
   - `VITE_API_URL`: Your live backend URL + `/api`.
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
5. Click **Deploy**.

### Deploying the Backend (Render)
EchoScholar includes a `render.yaml` for automatic deployment.
1. Connect your repository to [Render](https://render.com/).
2. Create a **New Blueprint Instance**.
3. Render will automatically detect the web service and configure it to use Python.
4. Go to the Render Dashboard and add your Environment Variables (API Keys, `DATABASE_URL` with `postgresql+asyncpg://`, etc.).

---

## 🔑 Environment Variables Reference

**Backend (`backend/.env`)**
- `DATABASE_URL`: Connection string (PostgreSQL or SQLite).
- `SECRET_KEY` / `ALGORITHM`: For JWT signing.
- `OPENAI_API_KEY`: For script generation and RAG.
- `GROQ_API_KEY` / `OPENROUTER_API_KEY`: Alternative ultra-fast LLMs.
- `ELEVENLABS_API_KEY`: Premium TTS (optional).

**Frontend (`frontend/.env`)**
- `VITE_BACKEND_URL`
- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or optimizations.

## 📝 License
This project is licensed under the MIT License.
