import pytest
from app.core.security import create_access_token, verify_password, get_password_hash

def test_password_hashing():
    password = "SuperSecretPassword123!"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("WrongPassword", hashed)

def test_jwt_token_generation():
    token_data = {"sub": "test@echoscholar.ai", "user_id": 1}
    token = create_access_token(token_data)
    assert isinstance(token, str)
    assert len(token) > 20
