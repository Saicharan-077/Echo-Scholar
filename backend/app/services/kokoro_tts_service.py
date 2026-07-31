import os
import tempfile
import asyncio
import httpx
from typing import List, Dict, Any, Optional

try:
    from pydub import AudioSegment
except ImportError:
    AudioSegment = None

from app.core.config import settings
from app.services.edge_tts_service import edge_tts_service



class KokoroTTSService:
    """TTS service wrapping Kokoro-82M via Replicate API with local/Edge TTS fallback."""

    def __init__(self):
        self.default_female_voice = "af_heart"
        self.default_male_voice = "am_adam"
        # Hexgrad Kokoro-82M voices
        self.voices = [
            {"id": "kokoro:af_heart", "name": "Kokoro — Heart (US Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:af_bella", "name": "Kokoro — Bella (US Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:af_nicole", "name": "Kokoro — Nicole (US Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:af_sarah", "name": "Kokoro — Sarah (US Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:af_sky", "name": "Kokoro — Sky (US Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:am_adam", "name": "Kokoro — Adam (US Male)", "gender": "male", "provider": "Kokoro-82M"},
            {"id": "kokoro:am_michael", "name": "Kokoro — Michael (US Male)", "gender": "male", "provider": "Kokoro-82M"},
            {"id": "kokoro:bf_emma", "name": "Kokoro — Emma (UK Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:bf_isabella", "name": "Kokoro — Isabella (UK Female)", "gender": "female", "provider": "Kokoro-82M"},
            {"id": "kokoro:bm_george", "name": "Kokoro — George (UK Male)", "gender": "male", "provider": "Kokoro-82M"},
            {"id": "kokoro:bm_fable", "name": "Kokoro — Fable (UK Male)", "gender": "male", "provider": "Kokoro-82M"},
        ]

    def get_available_voices(self) -> List[Dict[str, str]]:
        """Return list of supported Kokoro-82M voices."""
        return self.voices

    async def _generate_replicate_kokoro(self, text: str, voice_name: str, speed: float = 1.0) -> Optional[bytes]:
        """Generate audio using Replicate Kokoro-82M API."""
        replicate_key = os.getenv("REPLICATE_API_KEY") or getattr(settings, "replicate_api_key", None) or ""
        if not replicate_key or replicate_key.startswith("your_"):
            return None

        # Clean voice ID (strip kokoro: prefix if present)
        clean_voice = voice_name.replace("kokoro:", "")

        headers = {
            "Authorization": f"Bearer {replicate_key}",
            "Content-Type": "application/json",
            "Prefer": "wait"
        }

        # Try model predictions endpoints
        endpoints = [
            "https://api.replicate.com/v1/models/hexgrad/kokoro/predictions",
            "https://api.replicate.com/v1/models/lucataco/kokoro-82m/predictions",
            "https://api.replicate.com/v1/predictions"
        ]

        payload = {
            "input": {
                "text": text,
                "voice": clean_voice,
                "speed": speed
            }
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            for url in endpoints:
                try:
                    if "models" not in url:
                        # General predictions endpoint needs version hash
                        payload["version"] = "f55956091396b27e85246738914d115e5a251b5c464c23321d2fd9c5d1e23f03"
                    
                    response = await client.post(url, headers=headers, json=payload)
                    if response.status_code in [200, 201]:
                        data = response.json()
                        audio_url = None
                        
                        # Check direct output or polling output
                        if data.get("status") == "succeeded" and data.get("output"):
                            output = data["output"]
                            audio_url = output if isinstance(output, str) else (output[0] if isinstance(output, list) else None)

                        # If pending/processing, poll briefly
                        elif data.get("status") in ["starting", "processing"]:
                            get_url = data.get("urls", {}).get("get")
                            if get_url:
                                for _ in range(15):
                                    await asyncio.sleep(1.0)
                                    poll_res = await client.get(get_url, headers=headers)
                                    if poll_res.status_code == 200:
                                        p_data = poll_res.json()
                                        if p_data.get("status") == "succeeded" and p_data.get("output"):
                                            out = p_data["output"]
                                            audio_url = out if isinstance(out, str) else (out[0] if isinstance(out, list) else None)
                                            break
                                        elif p_data.get("status") == "failed":
                                            break

                        if audio_url:
                            audio_res = await client.get(audio_url)
                            if audio_res.status_code == 200:
                                print(f"Kokoro-82M API successfully generated audio for voice {clean_voice}")
                                return audio_res.content
                except Exception as e:
                    print(f"Kokoro Replicate attempt failed on {url}: {e}")
                    continue

        return None

    async def generate_speech(
        self,
        text: str,
        voice: str = "kokoro:af_heart",
        output_path: Optional[str] = None,
        speed: float = 1.0
    ) -> bool:
        """Generate speech file for given text using Kokoro-82M with Edge TTS fallback."""
        try:
            # 1. Try Kokoro-82M Replicate
            audio_bytes = await self._generate_replicate_kokoro(text, voice, speed)
            
            # 2. Fallback to Edge TTS if Replicate is not configured or fails
            if not audio_bytes:
                # Map Kokoro voice to high quality Edge voice
                edge_voice = "en-US-AvaNeural" if "af_" in voice or "bf_" in voice else "en-US-AndrewNeural"
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
                temp_path = temp_file.name
                temp_file.close()
                
                success = await edge_tts_service.generate_speech(text, edge_voice, temp_path)
                if success and os.path.exists(temp_path):
                    with open(temp_path, "rb") as f:
                        audio_bytes = f.read()
                    try:
                        os.remove(temp_path)
                    except Exception:
                        pass

            if audio_bytes and output_path:
                with open(output_path, "wb") as f:
                    f.write(audio_bytes)
                return True
            elif audio_bytes:
                return True

            return False
        except Exception as e:
            print(f"KokoroTTSService generate_speech error: {e}")
            return False

    async def generate_audio(self, text: str, voice: str = "kokoro:af_heart") -> Dict[str, Any]:
        """Generate audio on the fly for voice professor speak endpoint."""
        try:
            temp_dir = tempfile.gettempdir()
            file_name = f"voice_{os.urandom(8).hex()}.mp3"
            file_path = os.path.join(temp_dir, file_name)
            
            success = await self.generate_speech(text=text, voice=voice, output_path=file_path)
            if success and os.path.exists(file_path):
                return {
                    "success": True,
                    "file_path": file_path
                }
            return {
                "success": False,
                "error": "Failed to generate audio file"
            }
        except Exception as e:
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
        """Generate podcast dialogue audio with Kokoro-82M voices."""
        voice_m = voice_male or "kokoro:am_adam"
        voice_f = voice_female or "kokoro:af_heart"

        valid_entries = []
        for i, entry in enumerate(script):
            text = entry.get("text", "").strip()
            if text and not entry.get("is_recap", False):
                spk_val = str(entry.get("speaker", "A")).upper()
                v = voice_f if "B" in spk_val else voice_m
                valid_entries.append((i, entry, v))

        temp_files = []
        for idx, entry, voice in valid_entries:
            temp_fd, temp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(temp_fd)
            clean_t = entry.get("text", "")
            success = await self.generate_speech(clean_t, voice, temp_path, speed=speed)
            if success:
                temp_files.append((idx, temp_path))

        if AudioSegment is None:
            raw_bytes = []
            for idx, path in temp_files:
                try:
                    with open(path, "rb") as f:
                        raw_bytes.append(f.read())
                    os.remove(path)
                except Exception:
                    pass
            combined_bytes = b"".join(raw_bytes)
            if not combined_bytes:
                return await edge_tts_service.generate_podcast_audio(script, speed=speed)
            return combined_bytes, max(5.0, len(combined_bytes) / 16000.0)

        combined = AudioSegment.empty()
        for idx, path in temp_files:
            try:
                segment = AudioSegment.from_file(path)
                combined += segment
                combined += AudioSegment.silent(duration=300)  # 300ms pause between speakers
            except Exception as e:
                print(f"Error merging segment {idx}: {e}")

        # Cleanup temp files
        for idx, path in temp_files:
            try:
                os.remove(path)
            except Exception:
                pass

        if len(combined) == 0:
            # Fallback to Edge TTS podcast generator
            return await edge_tts_service.generate_podcast_audio(script, speed=speed)

        audio_bytes = combined.export(format="mp3").read()
        duration_sec = len(combined) / 1000.0

        return audio_bytes, duration_sec


kokoro_tts_service = KokoroTTSService()
