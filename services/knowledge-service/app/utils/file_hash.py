import hashlib


def generate_file_hash(file_path: str) -> str:
    """
    Generate SHA256 hash of a file.
    Used to detect duplicate document uploads.
    """
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()