class QueryPreprocessor:

    STOPWORDS = {
        "what", "is", "the", "a", "an",
        "of", "in", "on", "to", "for",
        "does", "do", "did", "are",
        "was", "were", "can", "could",
        "please", "tell", "me"
    }

    @staticmethod
    def preprocess(query: str) -> str:
        words = query.lower().split()

        return " ".join(
            word
            for word in words
            if word not in QueryPreprocessor.STOPWORDS
        )