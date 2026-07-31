import pytest
import asyncio
from app.services.openai_service import openai_service
from app.services.edge_tts_service import edge_tts_service

@pytest.mark.asyncio
async def test_full_podcast_generation_pipeline():
    paper_title = "EDU-ASSIST: Full-Stack AI Educational Assistant"
    summary = "This paper presents EDU-ASSIST, a full-stack educational assistant using local LLMs and RAG."
    key_findings = [
        "Local LLMs eliminate cloud API costs and protect student privacy.",
        "Retrieval-Augmented Generation prevents hallucination during active recall."
    ]
    doc_text = "EDU-ASSIST uses FastAPI, PyMuPDF, and Edge TTS to synthesize dual-host podcast episodes."

    # 1. Generate podcast script
    script = await openai_service.generate_podcast_script(
        paper_title=paper_title,
        summary=summary,
        key_findings=key_findings,
        style="educational",
        voice_male_name="Prabhat",
        voice_female_name="Neerja",
        document_text=doc_text
    )

    assert isinstance(script, list)
    assert len(script) > 0
    assert "speaker" in script[0]
    assert "text" in script[0]

    # 2. Synthesize audio with Edge TTS & pydub
    audio_bytes, duration = await edge_tts_service.generate_podcast_audio(
        script=script[:3], # Test first 3 dialogue lines for fast verification
        voice_male="en-IN-PrabhatNeural",
        voice_female="en-IN-NeerjaNeural",
        speed=1.0
    )

    assert isinstance(audio_bytes, bytes)
    assert len(audio_bytes) > 2000  # Valid MP3 file bytes
    assert duration > 0.5            # Valid duration in seconds
