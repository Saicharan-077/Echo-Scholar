# API Router
from fastapi import APIRouter
from app.api import (
    auth,
    papers,
    notes,
    users,
    chat,
    test,
    services,
    learning_dna,
    knowledge_graph,
    professor,
    adaptive_quiz,
    analytics,
    admin,
)

api_router = APIRouter(prefix="/api")

# Core platform routes
api_router.include_router(auth.router)
api_router.include_router(papers.router)
api_router.include_router(notes.router)
api_router.include_router(users.router)
api_router.include_router(chat.router)
api_router.include_router(test.router)
api_router.include_router(services.router)

# EchoScholar X feature routes
api_router.include_router(learning_dna.router)
api_router.include_router(knowledge_graph.router)
api_router.include_router(professor.router)
api_router.include_router(adaptive_quiz.router)
api_router.include_router(analytics.router)
api_router.include_router(admin.router)
