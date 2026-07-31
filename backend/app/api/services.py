"""
Services API — voice listing, etc.
"""
from fastapi import APIRouter
from app.services.edge_tts_service import edge_tts_service
from app.services.elevenlabs_service import elevenlabs_service
from app.services.kokoro_tts_service import kokoro_tts_service

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/voices/kokoro")
async def list_kokoro_voices():
    """Return available Kokoro-82M voices."""
    return kokoro_tts_service.get_available_voices()


@router.get("/voices/edge-tts")
async def list_edge_tts_voices():
    """Return available Edge TTS voices."""
    return edge_tts_service.get_available_voices()


@router.get("/voices/elevenlabs")
async def list_elevenlabs_voices():
    """Return available ElevenLabs voices."""
    return elevenlabs_service.get_available_voices()


@router.get("/voices")
async def list_all_voices():
    """Return all available voices from every provider."""
    return (
        kokoro_tts_service.get_available_voices()
        + edge_tts_service.get_available_voices()
        + elevenlabs_service.get_available_voices()
    )

