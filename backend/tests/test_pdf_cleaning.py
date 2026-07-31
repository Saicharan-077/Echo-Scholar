import pytest
from app.services.pdf_service import pdf_service

def test_pdf_clean_text_removes_font_descriptors():
    raw_pdf_output = """
    662 /StemV 0 /Leading 42 /XHeight 457 /AvgWidth 427 /MaxWidth 2000 /FontFile2
    [-568 -307 2000 1006] /ItalicAngle 0 /Ascent 891 /Descent -216 /CapHeight
    
    1. Executive Summary & Overview of EDUASSIST
    This study material covers the development of EDU-ASSIST, a full-stack AI-powered educational assistant.
    
    662 /StemV 102 /XHeight 454 /StemH 38 /AvgWidth 591 /MaxWidth 1721 /FontFile2
    << /Filter /FlateDecode /Length 7650 >>
    """
    
    cleaned = pdf_service._clean_text(raw_pdf_output)
    
    # Verify PDF font metadata is completely stripped
    assert "/StemV" not in cleaned
    assert "ItalicAngle" not in cleaned
    assert "FlateDecode" not in cleaned
    assert "CapHeight" not in cleaned
    
    # Verify human readable text remains intact
    assert "Executive Summary & Overview of EDUASSIST" in cleaned
    assert "full-stack AI-powered educational assistant" in cleaned
