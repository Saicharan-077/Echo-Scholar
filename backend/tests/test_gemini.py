import asyncio, os, httpx, json, pytest
from dotenv import load_dotenv
load_dotenv()

@pytest.mark.asyncio
async def test_gemini_models():
    gemini_key = os.getenv('GEMINI_API_KEY', '')
    print('API Key present:', bool(gemini_key and len(gemini_key) > 10))
    print('API Key prefix:', gemini_key[:8] if gemini_key else 'NONE')
    
    text = "The Socratic Sorting Algorithm uses comparative questioning to sort elements. Time complexity O(n log n)."
    
    for model_id in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']:
        try:
            url = f'https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}'
            payload = {
                'contents': [{'parts': [{'text': f'Generate 2 quiz questions from this text: {text}. Return JSON array only.'}]}],
                'systemInstruction': {'parts': [{'text': 'You output only JSON arrays of quiz questions with q, options, correct, explanation fields.'}]}
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
            print(f'{model_id}: status={res.status_code}')
            if res.status_code == 200:
                data = res.json()
                text_out = data['candidates'][0]['content']['parts'][0]['text']
                print('Response preview:', text_out[:400])
                break
            elif res.status_code == 429:
                print('Rate limited')
            else:
                print('Error:', res.text[:300])
        except Exception as e:
            print(f'{model_id}: Exception: {e}')

if __name__ == "__main__":
    asyncio.run(test_gemini_models())
