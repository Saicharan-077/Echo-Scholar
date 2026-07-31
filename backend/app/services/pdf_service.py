"""
PDF processing service for extracting text from research papers.
"""
import re
from typing import Dict, Any, Optional
import fitz  # PyMuPDF
from pathlib import Path
import os
import requests
from app.core.config import settings


class PDFService:
    """Service for PDF text extraction and processing."""
    
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def extract_text(self, file_path: str) -> str:
        """Extract text from a PDF, DOCX, PPTX, or TXT file."""
        ext = file_path.lower().split('.')[-1]
        if ext == 'txt':
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return self._clean_text(f.read())
            except Exception as e:
                raise Exception(f"Error reading TXT file: {str(e)}")
        
        if settings.pdf_co_api_key and ext == 'pdf':
            return await self._extract_with_pdf_co(file_path)
        else:
            return self._extract_with_pymupdf(file_path)

    def _extract_with_pymupdf(self, file_path: str) -> str:
        ext = file_path.lower().split('.')[-1]
        if ext == 'docx':
            return self._extract_docx_native(file_path)
        if ext == 'pptx':
            return self._extract_pptx_native(file_path)

        text_content = []
        try:
            doc = fitz.open(file_path)
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                text = self._clean_text(text)
                text_content.append(text)
            doc.close()
            return "\n\n".join(text_content)
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")

    async def _extract_with_pdf_co(self, file_path: str) -> str:
        """Use PDF.co to extract text from PDF."""
        url = "https://api.pdf.co/v1/pdf/convert/to/text"
        
        # 1. First upload the file to PDF.co temporary storage
        upload_url = "https://api.pdf.co/v1/file/upload/get-presigned-url"
        headers = {"x-api-key": settings.pdf_co_api_key}
        
        try:
            filename = os.path.basename(file_path)
            res = requests.get(upload_url, headers=headers, params={"name": filename})
            res.raise_for_status()
            data = res.json()
            
            presigned_url = data["presignedUrl"]
            file_url_pdfco = data["url"]

            with open(file_path, "rb") as f:
                requests.put(presigned_url, data=f, headers={"content-type": "application/pdf"})
            
            # 2. Extract Text via PDF.co
            extract_params = {
                "url": file_url_pdfco,
                "name": "result.txt"
            }
            extract_res = requests.post(url, headers=headers, json=extract_params)
            extract_res.raise_for_status()
            extract_data = extract_res.json()
            
            if extract_data.get("error"):
                raise Exception(extract_data.get("message"))
                
            # Download the result text file
            result_url = extract_data.get("url")
            text_res = requests.get(result_url)
            text_res.raise_for_status()
            
            return self._clean_text(text_res.text)
            
        except Exception as e:
            # Fallback to local
            print(f"PDF.co exception: {e}. Falling back to PyMuPDF")
            return self._extract_with_pymupdf(file_path)
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text."""
        if not text:
            return ""

        # Remove binary/control characters
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)

        # PDF internal metadata and font dictionary patterns
        pdf_meta_patterns = [
            r'StemV', r'StemH', r'XHeight', r'FontBBox', r'ItalicAngle', r'Ascent',
            r'Descent', r'CapHeight', r'FontFile', r'AvgWidth', r'MaxWidth', r'Leading',
            r'FlateDecode', r'Filter', r'Annots', r'Parent', r'Pages', r'Kids',
            r'First', r'Last', r'Outlines', r'Producer', r'ModDate', r'Root', r'Info',
            r'XYZ', r'<<', r'>>', r'\d+\s+0\s+R', r'/Type', r'/BBox', r'/Font'
        ]
        meta_regex = re.compile('|'.join(pdf_meta_patterns), re.IGNORECASE)

        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            stripped = line.strip()
            # Skip very short lines that are just numbers
            if len(stripped) < 3 and stripped.isdigit():
                continue
            # Skip PDF dictionary / font metadata lines
            if meta_regex.search(stripped):
                continue
            cleaned_lines.append(line)
        
        cleaned_text = '\n'.join(cleaned_lines)
        cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
        return cleaned_text
    
    async def extract_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata from PDF."""
        try:
            doc = fitz.open(file_path)
            metadata = doc.metadata
            
            result = {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "creator": metadata.get("creator", ""),
                "producer": metadata.get("producer", ""),
                "page_count": len(doc),
            }
            
            # Try to extract from first page if not in metadata
            if not result["title"] or not result["author"]:
                first_page_text = doc[0].get_text()
                result.update(self._extract_from_first_page(first_page_text))
            
            doc.close()
            return result
        
        except Exception as e:
            return {"error": str(e)}
    
    def _extract_from_first_page(self, text: str) -> Dict[str, Any]:
        """Attempt to extract title/author from first page."""
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        result = {"title": "", "author": ""}
        
        # Title is usually one of the first few non-empty lines
        for line in lines[:5]:
            # Skip lines that look like journal names or dates
            if any(skip in line.lower() for skip in ["abstract", "introduction", "doi", "journal", "volume"]):
                continue
            if len(line) > 10 and not line.isupper():
                result["title"] = line
                break
        
        # Author usually follows title
        if result["title"]:
            title_idx = lines.index(result["title"]) if result["title"] in lines else 0
            for line in lines[title_idx+1:title_idx+5]:
                if len(line) > 3 and len(line) < 100:
                    result["author"] = line
                    break
        
        return result
    
    def save_uploaded_file(self, file_content: bytes, filename: str, user_id: int) -> str:
        """Save an uploaded file and return the path."""
        # Create user directory
        user_dir = self.upload_dir / str(user_id)
        user_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        import uuid
        safe_filename = f"{uuid.uuid4()}_{filename}"
        file_path = user_dir / safe_filename
        
        # Write file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return str(file_path)
    
    def delete_file(self, file_path: str) -> bool:
        """Delete an uploaded file."""
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                return True
            return False
        except Exception:
            return False
    
    def _extract_docx_native(self, file_path: str) -> str:
        """Native DOCX parser using python's built-in zipfile."""
        import zipfile
        import xml.etree.ElementTree as ET
        try:
            with zipfile.ZipFile(file_path) as docx:
                xml_content = docx.read('word/document.xml')
                root = ET.fromstring(xml_content)
                namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                texts = [node.text for node in root.findall('.//w:t', namespaces) if node.text]
                return "\n\n".join(texts)
        except Exception as e:
            raise Exception(f"Native DOCX extraction error: {str(e)}")

    def _extract_pptx_native(self, file_path: str) -> str:
        """Native PPTX parser using python's built-in zipfile."""
        import zipfile
        import xml.etree.ElementTree as ET
        try:
            texts = []
            with zipfile.ZipFile(file_path) as pptx:
                # Sort slide files alphabetically
                slide_files = sorted([f for f in pptx.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')])
                for slide_file in slide_files:
                    xml_content = pptx.read(slide_file)
                    root = ET.fromstring(xml_content)
                    namespaces = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
                    slide_texts = [node.text for node in root.findall('.//a:t', namespaces) if node.text]
                    if slide_texts:
                        texts.append(" ".join(slide_texts))
            return "\n\n--- Slide ---\n\n".join(texts)
        except Exception as e:
            raise Exception(f"Native PPTX extraction error: {str(e)}")

    def get_file_size(self, file_path: str) -> int:
        """Get file size in bytes."""
        try:
            return Path(file_path).stat().st_size
        except Exception:
            return 0


# Singleton instance
pdf_service = PDFService()

