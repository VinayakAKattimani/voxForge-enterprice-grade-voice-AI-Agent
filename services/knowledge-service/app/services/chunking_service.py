from langchain_text_splitters import RecursiveCharacterTextSplitter


class ChunkingService:

    def chunk_text(
        self,
        text: str,
    ):

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=500,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

        return splitter.split_text(text)