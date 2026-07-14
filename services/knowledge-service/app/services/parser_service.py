import fitz  # PyMuPDF
from pathlib import Path


class ParserService:

    def extract_text(
        self,
        file_path: str,
    ) -> str:

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return self._extract_pdf(file_path)

        elif extension == ".txt":
            return self._extract_txt(file_path)

        raise ValueError("Unsupported file type")

    def _extract_pdf(
        self,
        file_path: str,
    ) -> str:

        document = fitz.open(file_path)

        text = ""

        for page in document:
            text += page.get_text()

        document.close()

        return text

    def _extract_txt(
        self,
        file_path: str,
    ) -> str:

        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()