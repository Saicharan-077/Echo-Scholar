# EchoScholar X - Technical Architecture & Hackathon Final Report

## 1. Executive Summary & Product Architecture

**EchoScholar X** is a production-quality **AI Personal Learning Companion** ("The AI That Learns You Before It Teaches You"). 

Every student interaction automatically updates their persistent **Cognitive Twin Learning DNA**, which drives AI explanation style, adaptive quiz difficulty, prerequisite gap detection, and personalized study roadmaps.

```
+-----------------------------------------------------------------------------------+
|                                 FRONTEND LAYER                                    |
|   React (Vite) + Tailwind CSS + Lucide Icons + AppLayout Glassmorphism Theme      |
|   Pages: Index, Dashboard, VoiceProfessor, PlacementMode, LectureAssistant, QA,   |
|          AdaptiveQuizzes, LearningPath, GamificationHub, Notes, Upload, Profile,  |
|          AdminDashboard                                                           |
+----------------------------------------+------------------------------------------+
                                         | REST / HTTP API (Port 2679 -> 8000)
                                         v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|   /api/learning-dna  |  /api/knowledge-graph  |  /api/professor  |  /api/quiz     |
|   /api/lecture       |  /api/placement        |  /api/admin       |  /api/path     |
+----------------------------------------+------------------------------------------+
                                         |
               +-------------------------+-------------------------+
               |                                subterranean               |
               v                                                   v
+-----------------------------+                         +-----------------------------+
|    MULTI-AGENT ECOSYSTEM    |                         |    COGNITIVE TWIN ENGINE    |
|  - Coordinator Router       |                         |  - Learning DNA Service     |
|  - Teacher Agent            |                         |  - Concept Dependency DAG   |
|  - Adaptive Quiz Agent      |                         |  - AI Confusion Detector    |
|  - Placement Interview Coach|                         |  - Activity Logger Service  |
+--------------+--------------+                         +--------------+--------------+
               |                                                   |
               +-------------------------+-------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                DATABASE & VECTOR LAYER                            |
|   SQLAlchemy (aiosqlite / SQLite / Supabase PostgreSQL)                          |
|   Models: Users, LearningDNA, ConceptNodes, ActivityLogs, Quizzes, Placement      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Configured Judge Persona Accounts

The database auto-seeds 5 realistic candidate accounts on application startup:

| Role | Email | Password | Pre-seeded Background |
|---|---|---|---|
| **Standard Student** | `demo@EchoScholar.ai` | `Demo@123` | 3 months learning history, 75% DSA mastery, 5-day streak, 1,450 XP |
| **Advanced Candidate** | `advanced@EchoScholar.ai` | `Demo@123` | 92% mastery, Level 5 Scholar, 3,200 XP, DSA Specialist |
| **Beginner Student** | `beginner@EchoScholar.ai` | `Demo@123` | 45% mastery, active prerequisite gap warning on Recursion & DP |
| **Placement Candidate** | `placement@EchoScholar.ai` | `Demo@123` | System Design caching, HR & Technical mock interview scorecards |
| **System Admin Lead** | `admin@EchoScholar.ai` | `Admin@123` | Full administrative audit privileges, user manager, activity logs |

---

## 3. Product Deliverables Summary

1. **Startup Marketing Landing Page ([Index.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/Index.tsx))**:
   - Modern glassmorphic hero section, 1-click Judge Persona Credentials launcher, animated statistics, feature showcase, tech stack breakdown, and footer.
2. **Command Center Dashboard ([Dashboard.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/Dashboard.tsx))**:
   - Cognitive Twin status widget, interactive Concept Dependency Graph, 30-day study heatmap, learning analytics charts, quick agent action cards, and judge persona quick-switcher.
3. **Voice AI Professor ([VoiceProfessor.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/VoiceProfessor.tsx))**:
   - Realtime voice classroom with speech-to-text, neural TTS audio, Socratic follow-up questions, analogies, and multilingual support (*English, Telugu, Hindi, Teluglish, Hinglish*).
4. **Multi-Agent Classroom ([QA.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/QA.tsx))**:
   - Agent router supporting 11 specialized agents (*Teacher, Quiz Master, Notes Agent, Planner, Career Mentor, Interview Coach, Research Assistant, Motivator*), RAG citations, and interactive suggestion chips.
5. **Placement Preparation Hub ([PlacementMode.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/PlacementMode.tsx))**:
   - Practice suite for DSA, System Design, SQL & DBMS, OS & CN, HR & Behavioral, React Engineering with AI Mock Interview scorecards.
6. **Live Lecture Assistant ([LectureAssistant.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/LectureAssistant.tsx))**:
   - Realtime lecture stream listener -> timestamped auto-notes -> mind map -> active recall flashcards -> quiz.
7. **Adaptive Quiz Engine ([AdaptiveQuizzes.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/AdaptiveQuizzes.tsx))**:
   - 7 difficulty tiers with diagnostic "WHY" mistake analysis.
8. **Personalized Study Path ([LearningPath.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/LearningPath.tsx))**:
   - Daily, weekly, monthly study roadmaps based on memory decay, exam dates, study hours, and weak topics.
9. **Gamification & Rewards Hub ([GamificationHub.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/GamificationHub.tsx))**:
   - XP, levels, daily streaks, study coins, unlockable store, and achievement badges.
10. **Document Ingestion Hub ([Upload.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/Upload.tsx))**:
    - Multi-format document uploader (PDF, PPT, DOCX, TXT) with FAISS vector chunking progress bar and chunk previews.
11. **Student Cognitive Twin Profile ([Profile.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/Profile.tsx))**:
    - Preferred language, explanation style, academic major, and career target goals.
12. **Admin Control Panel ([AdminDashboard.tsx](file:///c:/Users/Sai%20Charan/Desktop/echo-scholar/frontend/src/pages/AdminDashboard.tsx))**:
    - System activity log monitor, user list, and database re-seeder.

---

## 4. Deployment Instructions

```bash
# Start Backend FastAPI Server
cd backend
py -3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Start Frontend Vite App
cd frontend
npx vite --port 2679
```
