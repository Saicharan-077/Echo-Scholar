"""
EchoXScholar - Unified AI Model Router
Handles all AI interactions with support for:
1. Local Ollama LLM (llama3.2 / mistral / deepseek-r1 / phi3)
2. Google Gemini API (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash)
3. OpenAI API (gpt-4o / gpt-4o-mini / gpt-3.5-turbo)
4. Featherless.ai Llama-3.1
5. Smart Context-Aware Offline Synthesis Generator
"""
import os
import json
import httpx
import asyncio
from typing import Optional

from app.core.config import settings


class AIModelRouter:
    """
    Primary AI router supporting Ollama (Local), Gemini, OpenAI, Featherless, and Smart Offline Synthesis.
    System instruction and user prompt are always separated properly.
    """

    @classmethod
    async def generate_response(
        cls,
        prompt: str,
        system_instruction: str = "",
        model_name: str = "default",
        temperature: float = 0.7,
        max_tokens: int = 1500
    ) -> str:
        # 1. Try OpenRouter API (google/gemma-4-31B-it) if key is present
        openrouter_key = os.getenv("OPENROUTER_API_KEY") or getattr(settings, "openrouter_api_key", None) or ""
        openrouter_model = os.getenv("OPENROUTER_MODEL") or "google/gemma-4-31B-it"

        if openrouter_key and len(openrouter_key) > 10:
            try:
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {openrouter_key}",
                    "HTTP-Referer": "http://localhost:2679",
                    "X-Title": "EchoScholar AI",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": openrouter_model,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                async with httpx.AsyncClient(timeout=25.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        choices = data.get("choices", [])
                        if choices and choices[0].get("message", {}).get("content"):
                            text = choices[0]["message"]["content"]
                            print(f"AIModelRouter: Generated response using OpenRouter ({openrouter_model})")
                            return text
                    else:
                        print(f"OpenRouter status {res.status_code}: {res.text}")
            except Exception as e:
                print(f"OpenRouter exception: {e}")

        # 2. Try Local Ollama Instance if available
        ollama_host = os.getenv("OLLAMA_HOST") or os.getenv("OLLAMA_BASE_URL") or "http://localhost:11434"
        ollama_model = os.getenv("OLLAMA_MODEL") or "llama3.2"
        use_ollama = os.getenv("USE_OLLAMA", "true").lower() == "true"

        if use_ollama:
            try:
                url = f"{ollama_host.rstrip('/')}/api/generate"
                payload = {
                    "model": ollama_model,
                    "prompt": prompt,
                    "system": system_instruction,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        response_text = data.get("response", "")
                        if response_text and len(response_text.strip()) > 0:
                            print(f"AIModelRouter: Successfully generated response using Ollama ({ollama_model})")
                            return response_text
            except Exception:
                pass

        # 2. Try Gemini API if key is present
        gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None) or ""

        if gemini_key and len(gemini_key) > 10 and not gemini_key.startswith("your_"):
            for model_id in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
                for attempt in range(2):
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
                        async with httpx.AsyncClient(timeout=25.0) as client:
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
                            await asyncio.sleep(1.5 * (attempt + 1))

                        elif res.status_code in [400, 404]:
                            break

                    except Exception as e:
                        print(f"Gemini {model_id} exception: {e}")
                        await asyncio.sleep(0.5)

        # 3. Try OpenAI API if key is present
        openai_key = os.getenv("OPENAI_API_KEY") or getattr(settings, "openai_api_key", None) or ""
        if openai_key and len(openai_key) > 10 and not openai_key.startswith("sk-your_"):
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    url = "https://api.openai.com/v1/chat/completions"
                    headers = {
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json"
                    }
                    oa_payload = {
                        "model": getattr(settings, "openai_model", "gpt-4o-mini"),
                        "messages": [
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": temperature,
                        "max_tokens": max_tokens
                    }
                    res = await client.post(url, headers=headers, json=oa_payload)
                    if res.status_code == 200:
                        data = res.json()
                        text = data["choices"][0]["message"]["content"]
                        if text:
                            return text
            except Exception as e:
                print(f"OpenAI API error: {e}")

        # 4. Featherless.ai fallback
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

        # 5. Fail if no AI provider could fulfill the request
        raise ValueError("No AI provider available or all requests failed. Please configure an API key.")
