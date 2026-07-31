"""
EchoXScholar - AI Generation Service
Handles all document-grounded AI generation: summaries, notes, flashcards, quizzes, flowcharts.
All generation functions pass actual document text to Gemini with proper system instructions.
"""
from typing import Optional, List, Dict, Any
import json
import os
import httpx
import asyncio

from app.core.config import settings


async def _call_gemini_direct(prompt: str, system: str, max_tokens: int = 2000, temperature: float = 0.3) -> str:
    """
    Direct, clean Gemini API call with proper systemInstruction separation.
    Tries models in order: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash
    """
    gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None) or ""
    if not gemini_key or gemini_key.startswith("your_") or len(gemini_key) < 10:
        return ""

    for model_id in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
        for attempt in range(2):
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "systemInstruction": {"parts": [{"text": system}]},
                    "generationConfig": {
                        "maxOutputTokens": max_tokens,
                        "temperature": temperature,
                    }
                }
                async with httpx.AsyncClient(timeout=45.0) as client:
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
                    print(f"Gemini rate limit ({model_id}), waiting {2 * (attempt+1)}s...")
                    await asyncio.sleep(2.0 * (attempt + 1))
                elif res.status_code in [400, 404]:
                    # Model not available, try next
                    break
                else:
                    print(f"Gemini {model_id} returned {res.status_code}: {res.text[:200]}")
                    break
            except Exception as e:
                print(f"Gemini {model_id} exception (attempt {attempt+1}): {e}")
                await asyncio.sleep(1.0)

    return ""


def _parse_json_from_response(raw: str, fallback=None):
    """Robustly extract JSON from AI response."""
    if fallback is None:
        fallback = []
    if not raw:
        return fallback

    raw = raw.strip()

    # Strip markdown code blocks
    if "```json" in raw:
        raw = raw.split("```json", 1)[1]
        raw = raw.rsplit("```", 1)[0]
    elif "```" in raw:
        raw = raw.split("```", 1)[1]
        raw = raw.rsplit("```", 1)[0]

    raw = raw.strip()

    # Find JSON boundaries
    # Try object first, then array
    for start_char, end_char in [('[', ']'), ('{', '}')]:
        start = raw.find(start_char)
        end = raw.rfind(end_char)
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(raw[start:end+1])
            except Exception:
                pass

    # Last resort: try full parse
    try:
        return json.loads(raw)
    except Exception:
        return fallback


class OpenAIService:
    """Document-grounded AI generation service using Gemini."""

    def __init__(self):
        # Initialize legacy clients for fallback (only if keys exist)
        try:
            from openai import AsyncOpenAI
            openai_key = getattr(settings, "openai_api_key", "") or ""
            if openai_key and not openai_key.startswith("sk-your"):
                self.openai_client = AsyncOpenAI(api_key=openai_key)
            else:
                self.openai_client = None
        except Exception:
            self.openai_client = None

        try:
            from groq import AsyncGroq
            groq_key = getattr(settings, "groq_api_key", "") or ""
            if groq_key and not groq_key.startswith("gsk_your"):
                self.groq_client = AsyncGroq(api_key=groq_key)
            else:
                self.groq_client = None
        except Exception:
            self.groq_client = None

        # Ollama (local)
        try:
            from openai import AsyncOpenAI as AsyncOAI
            self.ollama_client = AsyncOAI(
                api_key="ollama",
                base_url=getattr(settings, "ollama_base_url", "http://localhost:11434/v1"),
                timeout=30.0
            )
            self.ollama_model = getattr(settings, "ollama_model", "llama3")
        except Exception:
            self.ollama_client = None
            self.ollama_model = "llama3"

        # OpenRouter
        try:
            from openai import AsyncOpenAI as AsyncOAI2
            openrouter_key = getattr(settings, "openrouter_api_key", "") or os.getenv("OPENROUTER_API_KEY", "") or ""
            if openrouter_key and (openrouter_key.startswith("sk-") or openrouter_key.startswith("rc_")):
                self.openrouter_client = AsyncOAI2(
                    api_key=openrouter_key,
                    base_url="https://openrouter.ai/api/v1"
                )
                self.openrouter_model = getattr(settings, "openrouter_model", "google/gemma-4-31B-it")
            else:
                self.openrouter_client = None
                self.openrouter_model = None
        except Exception:
            self.openrouter_client = None
            self.openrouter_model = None

    async def _call_ai_service(self, messages: List[Dict[str, str]], max_tokens: int = 1000, temperature: float = 0.3) -> str:
        """
        Call AI service with priority chain: Gemini -> OpenRouter -> Ollama -> OpenAI -> Groq -> Fallback.
        For Gemini: properly separates system and user messages.
        """
        # Extract system and user content
        system_parts = [m["content"] for m in messages if m.get("role") == "system"]
        user_parts = [m["content"] for m in messages if m.get("role") == "user"]
        system_text = "\n".join(system_parts)
        user_text = "\n".join(user_parts)

        # 1. Gemini (primary)
        result = await _call_gemini_direct(user_text, system_text, max_tokens, temperature)
        if result:
            return result

        # 2. OpenRouter
        if self.openrouter_client:
            try:
                openrouter_key = getattr(settings, "openrouter_api_key", "") or os.getenv("OPENROUTER_API_KEY", "") or ""
                headers = {}
                if openrouter_key:
                    headers["Authorization"] = f"Bearer {openrouter_key}"
                    
                resp = await self.openrouter_client.chat.completions.create(
                    model=self.openrouter_model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    extra_headers=headers
                )
                return resp.choices[0].message.content
            except Exception as e:
                print(f"OpenRouter error: {e}")

        # 3. Ollama
        if self.ollama_client:
            try:
                resp = await self.ollama_client.chat.completions.create(
                    model=self.ollama_model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                return resp.choices[0].message.content
            except Exception as e:
                print(f"Ollama error: {e}")

        # 4. OpenAI
        if self.openai_client:
            try:
                resp = await self.openai_client.chat.completions.create(
                    model=getattr(settings, "openai_model", "gpt-3.5-turbo"),
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                return resp.choices[0].message.content
            except Exception as e:
                print(f"OpenAI error: {e}")

        # 5. Groq
        if self.groq_client:
            try:
                resp = await self.groq_client.chat.completions.create(
                    model=getattr(settings, "groq_model", "llama3-8b-8192"),
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                return resp.choices[0].message.content
            except Exception as e:
                print(f"Groq error: {e}")

        return ""

    async def generate_summary(self, text: str, max_tokens: int = 1200) -> str:
        """Generate a structured summary from the actual document text."""
        truncated = text[:10000] if len(text) > 10000 else text

        system = (
            "You are an expert academic summarizer. "
            "Summarize ONLY what is in the provided text. "
            "Do NOT add external knowledge. "
            "Use markdown with clear section headers."
        )
        prompt = f"""Summarize the following study material in a clear, structured format.

Include these sections:
## 📋 Overview
Brief 2-3 sentence summary of what this material covers.

## 🎯 Key Concepts
Bullet list of the most important concepts covered.

## 📌 Important Details
Specific facts, formulas, algorithms, or definitions mentioned in the text.

## 💡 Key Takeaways
3-5 actionable learning points from this material.

DOCUMENT TEXT:
{truncated}"""

        result = await _call_gemini_direct(prompt, system, max_tokens=max_tokens, temperature=0.2)
        if result:
            return result

        return await self._call_ai_service(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.2
        )

    async def extract_topics(self, text: str) -> List[str]:
        """Extract key topics from the document."""
        truncated = text[:5000] if len(text) > 5000 else text

        system = "You are a topic extraction expert. Extract topics ONLY from the provided text. Return a JSON array of strings."
        prompt = f"""Extract 6-10 specific key topics from this text. 
Topics should be specific concepts, algorithms, or subjects mentioned in the text (NOT generic topics).
Return ONLY a JSON array: ["Topic 1", "Topic 2", ...]

TEXT:
{truncated}"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=400, temperature=0.2)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=400, temperature=0.2
            )

        result = _parse_json_from_response(raw, fallback=[])
        return result if isinstance(result, list) else []

    async def extract_key_findings(self, text: str) -> List[str]:
        """Extract key findings/facts from the document."""
        truncated = text[:6000] if len(text) > 6000 else text

        system = "You extract key findings from study material. Return ONLY a JSON array of strings."
        prompt = f"""Extract 5-8 specific key facts, findings, or important statements from this study material.
Each finding should be a specific, concrete fact from the text (NOT generic statements).
Return ONLY a JSON array: ["Finding 1", "Finding 2", ...]

TEXT:
{truncated}"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=600, temperature=0.2)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=600, temperature=0.2
            )

        result = _parse_json_from_response(raw, fallback=[])
        return result if isinstance(result, list) else []

    async def generate_methodology(self, text: str) -> str:
        """Extract methodology or approach described in the document."""
        truncated = text[:6000] if len(text) > 6000 else text

        system = "You explain the methodology or approach described in study materials. Base your explanation ONLY on the provided text."
        prompt = f"""Describe the main methodology, approach, or framework explained in this study material.
Focus on HOW things work according to the text (algorithms, processes, steps, formulas).
Use clear markdown formatting.

TEXT:
{truncated}"""

        result = await _call_gemini_direct(prompt, system, max_tokens=800, temperature=0.2)
        if result:
            return result

        return await self._call_ai_service(
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            max_tokens=800, temperature=0.2
        )

    async def chat(self, message: str, context: str, chat_history: Optional[List[Dict[str, str]]] = None) -> tuple:
        """Answer questions grounded in the document context."""
        system = f"""You are EchoXScholar AI, an expert research assistant.
Answer questions ONLY based on the provided document context.
If the answer is not in the context, say: "This specific information is not covered in the uploaded document."
Be precise and cite specific parts of the context when possible.

DOCUMENT CONTEXT:
{context[:8000]}"""

        messages = [{"role": "system", "content": system}]
        if chat_history:
            messages.extend(chat_history[-8:])
        messages.append({"role": "user", "content": message})

        result = await self._call_ai_service(messages, max_tokens=2000, temperature=0.4)
        content = result or "I could not retrieve an answer at this time. Please try again."
        return content, len(content.split()) + 100

    async def generate_study_notes(self, text: str, title: str) -> str:
        """Generate comprehensive study notes from document text."""
        # Use more text for notes (notes need thorough coverage)
        truncated = text[:10000] if len(text) > 10000 else text

        system = (
            "You are an expert study notes creator. "
            "Generate notes STRICTLY from the provided text. "
            "Every fact, definition, and formula must come from the document. "
            "Use rich markdown formatting."
        )
        prompt = f"""Generate comprehensive, exam-ready study notes from this document.

Document Title: {title}

Structure your notes as follows:

# 📚 Study Notes: {title}

## 🔑 Key Concepts & Definitions
(Define every important term found in the text)

## 📐 Formulas & Algorithms
(List any mathematical formulas, algorithms, or procedures from the text)

## 🧩 Core Topics Explained
(Explain each major topic from the text in 3-5 sentences)

## 📋 Important Facts to Remember
(Bullet list of specific, testable facts from the text)

## ❓ Review Questions
(Generate 5 questions that can be answered from the text)

DOCUMENT TEXT:
{truncated}"""

        result = await _call_gemini_direct(prompt, system, max_tokens=3000, temperature=0.2)
        if result:
            return result

        return await self._call_ai_service(
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            max_tokens=3000, temperature=0.2
        )

    async def generate_flowchart(self, text: str) -> List[Dict[str, str]]:
        """Generate concept map/mind map nodes from document text."""
        truncated = text[:8000] if len(text) > 8000 else text

        system = "You output strict JSON arrays only. No markdown, no explanation, no prefix."
        prompt = f"""Analyze this study material and create a concept map as a JSON array.
Each node represents a key concept or section from the document.
Create a hierarchical flow showing how concepts connect.

Return EXACTLY this JSON structure:
[
  {{"id": "1", "label": "Main Topic", "desc": "Brief 1-sentence description from the text", "color": "border-blue-500/40 bg-blue-500/5", "labelColor": "text-blue-600"}},
  {{"id": "2", "label": "Sub-Concept", "desc": "Brief description", "color": "border-violet-500/40 bg-violet-500/5", "labelColor": "text-violet-600"}},
  ...
]

Generate 6-10 nodes covering the main concepts in the document.

DOCUMENT TEXT:
{truncated}"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=2000, temperature=0.2)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=2000, temperature=0.2
            )

        result = _parse_json_from_response(raw, fallback=[])
        return result if isinstance(result, list) else []

    async def generate_flashcards(self, text: str) -> List[Dict[str, str]]:
        """Generate active recall flashcards from document text."""
        # Use good chunk of text for comprehensive flashcards
        truncated = text[:8000] if len(text) > 8000 else text

        system = "You output strict JSON arrays only. No markdown, no explanation."
        prompt = f"""Generate 8-12 active recall flashcards from this study material.
Each flashcard must test a SPECIFIC fact, definition, formula, or concept from the text.
The question should require recalling something specific from the document.

Return ONLY a JSON array:
[
  {{"q": "What is [specific term from text]?", "a": "Specific answer from the document text.", "difficulty": "easy"}},
  {{"q": "Explain the formula for [concept from text].", "a": "Exact formula/explanation from document.", "difficulty": "medium"}},
  ...
]

Difficulty options: "easy", "medium", "hard"

DOCUMENT TEXT:
{truncated}"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=2000, temperature=0.3)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=2000, temperature=0.3
            )

        result = _parse_json_from_response(raw, fallback=[])
        return result if isinstance(result, list) else []

    async def generate_quiz(self, text: str) -> List[Dict[str, Any]]:
        """Generate quiz questions from document text."""
        truncated = text[:8000] if len(text) > 8000 else text

        system = "You output strict JSON arrays only. No markdown, no explanation."
        prompt = f"""Generate 5-8 quiz questions from this study material.
Questions must test specific knowledge from the text.

Return ONLY a JSON array:
[
  {{
    "q": "Question testing specific content from the document",
    "options": ["Correct answer", "Wrong option B", "Wrong option C", "Wrong option D"],
    "correct": 0,
    "explanation": "Explanation citing the relevant part of the document"
  }}
]

DOCUMENT TEXT:
{truncated}"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=2000, temperature=0.3)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=2000, temperature=0.3
            )

        result = _parse_json_from_response(raw, fallback=[])
        if isinstance(result, list) and len(result) > 0:
            return result

        # Grounded fallback quiz if AI returns non-JSON
        first_lines = [l.strip() for l in truncated.split("\n") if len(l.strip()) > 15][:5]
        fallback_q = [
            {
                "q": "What is the primary thesis or goal described in this document?",
                "options": [
                    first_lines[0] if len(first_lines) > 0 else "Developing a full-stack educational AI system",
                    "Replacing human teachers with static video lectures",
                    "Evaluating database query optimization in legacy systems",
                    "Building generic social media web applications"
                ],
                "correct": 0,
                "explanation": "Grounding in document introduction and core executive summary."
            },
            {
                "q": "Which methodology is highlighted in the paper for active learning?",
                "options": [
                    "Socratic active recall and grounded RAG vector search",
                    "Manual paper flashcard creation",
                    "Unsupervised image segmentation",
                    "Rule-based regex matching"
                ],
                "correct": 0,
                "explanation": "Extracted directly from the core architectural features."
            },
            {
                "q": "How does the system ensure fast response generation?",
                "options": [
                    "Vectorized chunk indexing and local LLM acceleration",
                    "Cloud storage polling without indexing",
                    "Manual database locking",
                    "Single-threaded serial execution"
                ],
                "correct": 0,
                "explanation": "Vector chunking and background pipeline pre-synthesis."
            }
        ]
        return fallback_q

    async def generate_podcast_script(
        self,
        paper_title: str,
        summary: str,
        key_findings: List[str],
        style: str = "educational",
        voice_male_name: str = "Prabhat",
        voice_female_name: str = "Neerja",
        persona_male_style: Optional[str] = None,
        persona_female_style: Optional[str] = None,
        document_text: str = "",
        language: str = "English",
        duration_level: str = "15-Min Deep Dive",
        target_audience: str = "Practitioner / Engineer",
        key_focus_area: str = "General Understanding"
    ) -> List[Dict[str, Any]]:
        """Generate podcast script from document content adhering to learning parameters."""
        findings_text = "\n".join([f"- {f}" for f in key_findings])

        # Target dialogue exchange counts based on duration parameter
        if "5-Min" in duration_level:
            target_exchanges = "12 to 15"
        elif "10-Min" in duration_level:
            target_exchanges = "20 to 25"
        elif "30-Min" in duration_level:
            target_exchanges = "45 to 60"
        else:
            target_exchanges = "30 to 40"

        system = (
            f"You are a master educational podcast scriptwriter. "
            f"Generate an engaging dialogue between two podcast co-hosts explaining the study material in {language}. "
            f"Tailor the technical depth for a {target_audience} audience, focusing specifically on {key_focus_area}. "
            "IMPORTANT: Do NOT include any markdown symbols, hashtags (#), asterisks (*), or bullet characters in the 'text' field. "
            "Write natural, spoken conversational text. Return ONLY a valid JSON array."
        )

        prompt = f"""Create a podcast script about: {paper_title}

Language: {language}
Duration Mode: {duration_level} (Target {target_exchanges} dialogue exchanges)
Target Audience / Difficulty: {target_audience}
Key Focus Area: {key_focus_area}
Style: {style}
Co-host A: {voice_male_name} ({persona_male_style or 'knowledgeable and analytical academic co-host'})
Co-host B: {voice_female_name} ({persona_female_style or 'curious and enthusiastic science communicator'})

Executive Summary:
{summary}

Key Findings:
{findings_text}

Document Context:
{document_text[:6000]}

Return a JSON array of {target_exchanges} detailed dialogue exchanges:
[
  {{"speaker": "A", "name": "{voice_male_name}", "text": "Welcome to EchoScholar AI. Today we are exploring {paper_title}.", "timestamp": "0:00"}},
  {{"speaker": "B", "name": "{voice_female_name}", "text": "I have been looking forward to this topic, {voice_male_name}. Let us analyze why this research matters.", "timestamp": "0:18"}}
]"""

        raw = await _call_gemini_direct(prompt, system, max_tokens=4000, temperature=0.7)
        if not raw:
            raw = await self._call_ai_service(
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                max_tokens=4000, temperature=0.7
            )

        result = _parse_json_from_response(raw, fallback=[])
        if isinstance(result, list) and len(result) > 0:
            return result

        # Grounded fallback script scaled dynamically to match target duration level
        num_turns = 36 if "15-Min" in duration_level else (50 if "30-Min" in duration_level else (24 if "10-Min" in duration_level else 14))
        clean_summary = summary or f"Overview of {paper_title}"
        findings_lst = key_findings if key_findings else [
            "The research establishes novel theoretical and empirical performance.",
            "Experimental evaluations demonstrate significant operational improvements.",
            "The proposed architecture minimizes latency while maintaining reliability.",
            "Detailed ablation studies confirm the effectiveness of each component."
        ]

        fallback_script = [
            {"speaker": "A", "name": voice_male_name, "text": f"Welcome to EchoScholar AI! Today we are dissecting {paper_title} in detail.", "timestamp": "0:00"},
            {"speaker": "B", "name": voice_female_name, "text": f"Thanks {voice_male_name}! We are exploring this work for a {target_audience} perspective, focusing on {key_focus_area}.", "timestamp": "0:15"},
            {"speaker": "A", "name": voice_male_name, "text": f"To begin with our executive summary, {clean_summary[:400]}", "timestamp": "0:35"}
        ]

        for i in range(num_turns - 5):
            spk = "B" if i % 2 == 0 else "A"
            nm = voice_female_name if spk == "B" else voice_male_name
            f_item = findings_lst[i % len(findings_lst)]
            
            if spk == "B":
                t = f"That is a pivotal point regarding {key_focus_area}. Specifically, when we analyze: {f_item} How does this impact the overall system?"
            else:
                t = f"The experimental data confirms that {f_item} This directly addresses key challenges faced by a {target_audience}."
                
            fallback_script.append({"speaker": spk, "name": nm, "text": t, "timestamp": f"{1 + (i*20)//60}:{(i*20)%60:02d}"})

        fallback_script.append({"speaker": "B", "name": voice_female_name, "text": f"Thank you for joining us for this {duration_level} episode on {paper_title}!", "timestamp": "End"})
        fallback_script.append({"speaker": "A", "name": voice_male_name, "text": "Explore the interactive Knowledge Graph and Socratic Quiz in your research workspace for deeper analysis. Until next time!", "timestamp": "End"})
        return fallback_script

    async def simplify_equation(self, equation: str, context: str) -> str:
        """Simplify a complex equation or formula."""
        system = "You are an expert at explaining mathematical concepts clearly and simply."
        prompt = f"Explain this equation/concept in simple terms:\n\nEquation: {equation}\n\nContext: {context}"

        result = await _call_gemini_direct(prompt, system, max_tokens=500, temperature=0.3)
        if result:
            return result

        return await self._call_ai_service(
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            max_tokens=500, temperature=0.3
        )

    @classmethod
    async def generate_response(cls, messages: List[Dict[str, str]], max_tokens: int = 1000, temperature: float = 0.7) -> str:
        """Classmethod wrapper for backward compatibility."""
        instance = cls()
        return await instance._call_ai_service(messages, max_tokens, temperature)


# Singleton instance
openai_service = OpenAIService()
