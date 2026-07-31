import pytest
from app.services.openai_service import _parse_json_from_response

def test_parse_json_from_response():
    raw_markdown_json = '```json\n[{"q": "What is self-attention?", "options": ["A", "B"], "correct": 0}]\n```'
    parsed = _parse_json_from_response(raw_markdown_json)
    assert isinstance(parsed, list)
    assert len(parsed) == 1
    assert parsed[0]["q"] == "What is self-attention?"

def test_parse_json_fallback():
    invalid_response = "I am an AI assistant and here is your response."
    parsed = _parse_json_from_response(invalid_response, fallback={"is_feasible": False})
    assert parsed == {"is_feasible": False}
