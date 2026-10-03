from pathlib import Path
from uuid import uuid4

class MasterImageStorage:

    def __init__(self, base_directory: str = "masterImages"):
        self.base_directory = Path(base_directory)

    def get_space_directory(
        self,
        owner_id: str,
        property_id: str,
        space_id: str,
    ) -> Path:

        return (
            self.base_directory
            / owner_id
            / property_id
            / space_id
        )

    def create_space_directory(
        self,
        owner_id: str,
        property_id: str,
        space_id: str,
    ) -> Path:

        directory = self.get_space_directory(
            owner_id=owner_id,
            property_id=property_id,
            space_id=space_id,
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    def save_space_image(
        self,
        owner_id: str,
        property_id: str,
        space_id: str,
        content: bytes,
        content_type: str | None,
    ) -> Path:
        extensions = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/heic": ".heic",
            "image/heif": ".heif",
        }
        extension = extensions.get(content_type or "")
        if extension is None:
            raise ValueError("Unsupported image type.")
        if not content:
            raise ValueError("Image file is empty.")

        directory = self.create_space_directory(
            owner_id=owner_id,
            property_id=property_id,
            space_id=space_id,
        )
        image_path = directory / f"{uuid4().hex}{extension}"
        try:
            image_path.write_bytes(content)
        except OSError:
            image_path.unlink(missing_ok=True)
            raise
        return image_path