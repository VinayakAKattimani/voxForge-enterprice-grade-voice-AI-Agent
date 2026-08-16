import re
import fitz  # PyMuPDF
from pathlib import Path


class ParserService:

    def extract_text(
        self,
        file_path: str,
    ) -> str:

        extension = Path(file_path).suffix.lower()

        

        if extension == ".pdf":
            text = self._extract_pdf(file_path)

        elif extension == ".txt":
            text = self._extract_txt(file_path)

        else:
            raise ValueError("Unsupported file type")

        cleaned_text = self._clean_text(text)
        
        if not cleaned_text:
            raise ValueError("No usable text could be extracted from document")
        
        return cleaned_text

    def _extract_pdf(
        self,
        file_path: str,
    ) -> str:

        document = fitz.open(file_path)

        pages = []

        for page in document:
            page_text = page.get_text()

            if page_text:
                pages.append(page_text)

        document.close()

        return "\n\n".join(pages)

    def _extract_txt(
        self,
        file_path: str,
    ) -> str:

        with open(
            file_path,
            "r",
            encoding="utf-8",
        ) as file:
            return file.read()

    def _clean_text(
        self,
        text: str,
    ) -> str:

        # Normalize line endings
        text = text.replace("\r\n", "\n")
        text = text.replace("\r", "\n")

        # Remove excessive whitespace
        text = re.sub(r"[ \t]+", " ", text)

        # Normalize excessive blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)

        # Remove obvious OCR garbage
        cleaned_lines = []

        for line in text.splitlines():

            line = line.strip()

            if not line:
                continue

            if self._is_garbage_line(line):
                continue

            cleaned_lines.append(line)

        return "\n".join(cleaned_lines).strip()

    def _is_garbage_line(
        self,
        line: str,
    ) -> bool:

        # Very short lines are usually not useful
        if len(line) < 2:
            return True

        # Detect numeric/OCR garbage such as:
        # "1 68 3 68 4 69 ..."
        tokens = line.split()

        if len(tokens) >= 5:

            numeric_tokens = sum(
                token.isdigit()
                for token in tokens
            )

            if numeric_tokens / len(tokens) >= 0.8:
                return True

        return False