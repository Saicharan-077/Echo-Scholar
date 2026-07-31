"""
TTS service using Microsoft Edge TTS (Free, no API key required).
Supports high-quality neural voices including Indian English accents.
"""
import asyncio
import os
try:
    import edge_tts
except ImportError:
    edge_tts = None
from typing import List, Dict, Any, Optional

class EdgeTTSService:
    """TTS service wrapping edge-tts."""

    def __init__(self):
        # Default Indian English voices
        self.default_male_voice = "en-IN-PrabhatNeural"
        self.default_female_voice = "en-IN-NeerjaNeural"

    def get_available_voices(self) -> List[Dict[str, str]]:
        """Get list of available Edge TTS voices."""
        return [
            {"id": "en-IN-PrabhatNeural", "name": "Prabhat (Indian Male)", "gender": "male", "lang": "en-IN"},
            {"id": "en-IN-NeerjaNeural", "name": "Neerja (Indian Female)", "gender": "female", "lang": "en-IN"},
            {"id": "en-US-GuyNeural", "name": "Guy (US Male)", "gender": "male", "lang": "en-US"},
            {"id": "en-US-JennyNeural", "name": "Jenny (US Female)", "gender": "female", "lang": "en-US"},
            {"id": "en-GB-RyanNeural", "name": "Ryan (UK Male)", "gender": "male", "lang": "en-GB"},
            {"id": "en-GB-SoniaNeural", "name": "Sonia (UK Female)", "gender": "female", "lang": "en-GB"}
        ]

    def _text_to_ssml(self, text: str, voice: str) -> str:
        import re
        import html

        parts = re.split(r'\*\*(.+?)\*\*', text)
        
        ssml_body = ""
        for i, part in enumerate(parts):
            if i % 2 == 0:
                ssml_body += html.escape(part)
            else:
                ssml_body += (
                    f'<emphasis level="strong">'
                    f'<prosody volume="+30%">{html.escape(part)}</prosody>'
                    f'</emphasis>'
                )

        ssml = (
            f'<speak version="1.0" '
            f'xmlns="http://www.w3.org/2001/10/synthesis" '
            f'xml:lang="en-IN">'
            f'<voice name="{voice}">{ssml_body}</voice>'
            f'</speak>'
        )
        return ssml

    async def generate_speech(
        self,
        text: str,
        voice: str,
        output_path: str
    ) -> bool:
        try:
            import re
            clean_text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
            communicate = edge_tts.Communicate(clean_text, voice)
            await communicate.save(output_path)
            return True
        except Exception as e:
            print(f"Edge TTS Error: {e}")
            try:
                import re
                plain = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
                communicate = edge_tts.Communicate(plain, voice)
                await communicate.save(output_path)
                return True
            except Exception as e2:
                print(f"Edge TTS Fallback Error: {e2}")
                return False

    @classmethod
    async def generate_audio(cls, text: str, voice: str) -> Dict[str, Any]:
        """Generate audio on the fly for voice professor speak endpoint."""
        import tempfile
        import os
        import edge_tts
        
        try:
            temp_dir = tempfile.gettempdir()
            file_name = f"voice_{os.urandom(8).hex()}.mp3"
            file_path = os.path.join(temp_dir, file_name)
            
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(file_path)
            
            return {
                "success": True,
                "file_path": file_path
            }
        except Exception as e:
            print(f"generate_audio error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def generate_podcast_audio(
        self,
        script: List[Dict[str, Any]],
        voice_male: Optional[str] = None,
        voice_female: Optional[str] = None,
        speed: float = 1.0
    ) -> tuple[bytes, float]:
        import tempfile
        import asyncio
        from pydub import AudioSegment

        male_voice = voice_male or self.default_male_voice
        female_voice = voice_female or self.default_female_voice

        valid_entries = []
        for i, entry in enumerate(script):
            text = entry.get("text", "").strip()
            if text and not entry.get("is_recap", False):
                spk_val = str(entry.get("speaker", "A")).upper()
                voice = female_voice if "B" in spk_val else male_voice
                valid_entries.append((i, entry, voice))

        # Parallel TTS generation
        temp_files = []
        tasks = []
        for i, entry, voice in valid_entries:
            temp_fd, temp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(temp_fd)
            temp_files.append((i, temp_path))
            
            clean_t = entry.get("text", "")
            tasks.append(self.generate_speech(clean_t, voice, temp_path))

        await asyncio.gather(*tasks)

        # Merge segments using pydub
        combined = AudioSegment.empty()
        for idx, path in temp_files:
            try:
                segment = AudioSegment.from_mp3(path)
                combined += segment
            except Exception as e:
                print(f"Error loading podcast segment {idx}: {e}")

        # Cleanup temp files
        for idx, path in temp_files:
            try:
                os.remove(path)
            except Exception:
                pass

        # Speed adjustment if requested
        if speed != 1.0 and abs(speed - 1.0) > 0.05:
            try:
                combined = combined.speedup(playback_speed=speed)
            except Exception as e:
                print(f"Pydub speedup failed: {e}")

        audio_bytes = combined.export(format="mp3").read()
        duration_sec = len(combined) / 1000.0
        return audio_bytes, duration_sec


edge_tts_service = EdgeTTSService()
