"""
EchoScholar X - Unified AI Model Router
Handles all AI interactions with proper Gemini API calls.
System instruction and user prompt are always separated properly.
"""
import os
import json
import httpx
import asyncio
from typing import Optional

from app.core.config import settings


class AIModelRouter:
    """
    Primary AI router. Calls Gemini with proper systemInstruction separation.
    Falls back to Featherless.ai if Gemini fails.
    """

    @classmethod
    async def generate_response(
        cls,
        prompt: str,
        system_instruction: str = "You are Professor Vox, an expert AI Personal Professor.",
        model_name: str = "default",
        temperature: float = 0.7,
        max_tokens: int = 1500
    ) -> str:
        """Generate AI response using Gemini with proper payload structure."""

        gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None) or ""

        if gemini_key and len(gemini_key) > 10 and not gemini_key.startswith("your_"):
            # Try Gemini models in order
            for model_id in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
                for attempt in range(3):
                    try:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
                        payload = {
                            "contents": [
                                {"parts": [{"text": prompt}]}
                            ],
                            "systemInstruction": {
                                "parts": [{"text": system_instruction}]
                            },
                            "generationConfig": {
                                "maxOutputTokens": max_tokens,
                                "temperature": temperature,
                            }
                        }
                        async with httpx.AsyncClient(timeout=30.0) as client:
                            res = await client.post(url, json=payload)

                        if res.status_code == 200:
                            data = res.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                if parts:
                                    text = parts[0].get("text", "")
                                    if text:
                                        return text

                        elif res.status_code == 429:
                            wait_time = 2.0 * (attempt + 1)
                            print(f"Gemini ({model_id}) rate limit. Waiting {wait_time}s (attempt {attempt+1}/3)...")
                            await asyncio.sleep(wait_time)

                        elif res.status_code in [400, 404]:
                            # Model not available, try next
                            print(f"Gemini {model_id} not available ({res.status_code}), trying next...")
                            break

                        else:
                            print(f"Gemini {model_id} error {res.status_code}: {res.text[:200]}")
                            break

                    except Exception as e:
                        print(f"Gemini {model_id} exception (attempt {attempt+1}): {e}")
                        await asyncio.sleep(1.0)

        # Featherless.ai fallback
        featherless_key = os.getenv("FEATHERLESS_API_KEY") or getattr(settings, "featherless_api_key", None) or ""
        if featherless_key and len(featherless_key) > 10:
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    url = "https://api.featherless.ai/v1/chat/completions"
                    headers = {
                        "Authorization": f"Bearer {featherless_key}",
                        "Content-Type": "application/json"
                    }
                    fl_payload = {
                        "model": getattr(settings, "featherless_model", "meta-llama/Meta-Llama-3.1-70B-Instruct"),
                        "messages": [
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": temperature,
                        "max_tokens": max_tokens
                    }
                    res = await client.post(url, headers=headers, json=fl_payload)
                    if res.status_code == 200:
                        data = res.json()
                        text = data["choices"][0]["message"]["content"]
                        if text:
                            return text
            except Exception as e:
                print(f"Featherless.ai error: {e}")

        # Final fallback: return an honest message
        return (
            "I'm unable to generate a response right now due to API quota limits. "
            "Please try again in a few minutes. "
            "Your document has been processed and will be ready for questions shortly."
        )
