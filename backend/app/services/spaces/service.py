from pathlib import Path
import logging

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.shared.db.models import Property,Space,Prompt,MasterImage

from app.shared.db.enums import SpaceType
from app.shared.utils.master_image_storage import MasterImageStorage

logger = logging.getLogger(__name__)


class SpaceService:

    def __init__(
        self,
        db: Session,
        storage: MasterImageStorage | None = None,
    ):
        self.db = db
        self.storage = storage or MasterImageStorage()

    def get_spaces_by_property(
        self,
        property_id: str,
        user_id: str,
        space_type: SpaceType | None = None,
    ):
        # 1. Validate property_id
        if not property_id:
            raise ValueError("Property ID is required.")

        # 2. Validate authenticated user
        if not user_id:
            raise PermissionError("Authenticated user is required.")

        # 3. Check that the property exists AND belongs to the user
        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )

        if property is None:
            raise LookupError("Property not found or access denied.")

        # 4. Fetch spaces belonging to this property
        stmt = (
            select(Space)
            .options(selectinload(Space.master_images))
            .where(Space.property_id == property_id)
        )

        # 5. Optional space type filter
        if space_type is not None:
            stmt = stmt.where(
                Space.space_type == space_type
            )

        # 6. Return spaces
        stmt = stmt.order_by(Space.created_at.asc())

        return self.db.scalars(stmt).all()

    def get_master_image_path(
        self,
        property_id: str,
        space_id: str,
        user_id: str,
    ) -> Path:
        if not property_id or not space_id:
            raise ValueError("Property ID and space ID are required.")
        if not user_id:
            raise PermissionError("Authenticated user is required.")

        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )
        if property is None:
            raise LookupError("Property not found or access denied.")

        space = self.db.scalar(
            select(Space).where(
                Space.id == space_id,
                Space.property_id == property_id,
            )
        )
        if space is None:
            raise LookupError("Space not found for this property.")

        master_image = self.db.scalar(
            select(MasterImage)
            .where(
                MasterImage.property_id == property_id,
                MasterImage.space_id == space_id,
            )
            .order_by(MasterImage.created_at.asc())
        )
        if master_image is None or not master_image.master_image_url:
            raise LookupError("Master image not found for this space.")

        space_directory = self.storage.get_space_directory(
            owner_id=user_id,
            property_id=property_id,
            space_id=space_id,
        ).resolve()
        image_path = Path(master_image.master_image_url).resolve()
        try:
            image_path.relative_to(space_directory)
        except ValueError as exc:
            raise LookupError("Master image file is outside the space directory.") from exc
        if not image_path.is_file():
            raise LookupError("Master image file not found.")
        return image_path

    def add_space(
        self,
        property_id: str,
        user_id: str,
        space_type: SpaceType,
        name: str,
        prompt_id: str | None = None,
        description: str | None = None,
        image_content: bytes | None = None,
        content_type: str | None = None,
    ):

        # ---------------------------------------------
        # 1. Validate input
        # ---------------------------------------------

        if not property_id:
            raise ValueError("Property ID is required.")

        if not user_id:
            raise PermissionError(
                "Authenticated user is required."
            )

        if not name or not name.strip():
            raise ValueError(
                "Space name is required."
            )

        # ---------------------------------------------
        # 2. Verify property ownership
        # ---------------------------------------------

        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )

        if property is None:
            raise LookupError(
                "Property not found or access denied."
            )

        # ---------------------------------------------
        # 3. Verify prompt
        # ---------------------------------------------

        if prompt_id:

            prompt = self.db.scalar(
                select(Prompt).where(
                    Prompt.id == prompt_id,
                    Prompt.property_id == property_id,
                )
            )

            if prompt is None:
                raise LookupError(
                    "Prompt not found for this property."
                )

        # ---------------------------------------------
        # 4. Create Space
        # ---------------------------------------------

        saved_image = None
        try:
            space = Space(
                property_id=property_id,
                name=name.strip(),
                space_type=space_type,
                description=(
                    description.strip()
                    if description and description.strip()
                    else None
                ),
            )
            self.db.add(space)
            self.db.flush()

            master_image = MasterImage(
                property_id=property_id,
                space_id=space.id,
                prompt_id=prompt_id,
                master_image_url="",
            )
            self.db.add(master_image)

            if image_content is not None:
                saved_image = self.storage.save_space_image(
                    owner_id=user_id,
                    property_id=property_id,
                    space_id=space.id,
                    content=image_content,
                    content_type=content_type,
                )
                master_image.master_image_url = saved_image.as_posix()

            self.db.flush()
            self.db.refresh(space)
            self.db.refresh(master_image)
            self.db.commit()
        except Exception:
            logger.exception(
                "Space transaction failed property_id=%s user_id=%s type=%s has_photo=%s",
                property_id,
                user_id,
                space_type.value,
                image_content is not None,
            )
            self.db.rollback()
            if saved_image is not None:
                try:
                    saved_image.unlink(missing_ok=True)
                except OSError:
                    logger.exception(
                        "Failed to remove image after space transaction rollback path=%s",
                        saved_image,
                    )
            raise

        return {
            "space": space,
            "master_image": master_image,
        }

    def upload_master_image(
        self,
        property_id: str,
        space_id: str,
        user_id: str,
        content: bytes,
        content_type: str | None,
    ) -> str:
        if not property_id or not space_id:
            raise ValueError("Property ID and space ID are required.")
        if not user_id:
            raise PermissionError("Authenticated user is required.")

        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )
        if property is None:
            raise LookupError("Property not found or access denied.")

        space = self.db.scalar(
            select(Space).where(
                Space.id == space_id,
                Space.property_id == property_id,
            )
        )
        if space is None:
            raise LookupError("Space not found for this property.")

        saved_image = self.storage.save_space_image(
            owner_id=user_id,
            property_id=property_id,
            space_id=space_id,
            content=content,
            content_type=content_type,
        )
        image_path = saved_image.as_posix()

        master_image = self.db.scalar(
            select(MasterImage)
            .where(
                MasterImage.property_id == property_id,
                MasterImage.space_id == space_id,
            )
            .order_by(MasterImage.created_at.asc())
        )
        if master_image is None:
            master_image = MasterImage(
                property_id=property_id,
                space_id=space_id,
                master_image_url=image_path,
            )
            self.db.add(master_image)
        else:
            master_image.master_image_url = image_path

        try:
            self.db.commit()
            
            try:
                prompt = (
                    self.db.get(Prompt, master_image.prompt_id)
                    if master_image.prompt_id else None
                )
                self.generate_master_baseline(property_id, space_id, saved_image, prompt)
            except Exception:
                logger.exception("Baseline generation failed space_id=%s", space_id)
            
        except Exception:
            self.db.rollback()
            saved_image.unlink(missing_ok=True)
            raise
        

        return image_path
    
    def generate_master_baseline(
        self,
        property_id: str,
        space_id: str,
        master_image_path: Path,
        prompt: Prompt | None,
    ) -> None:
        """Generate the pipeline baseline JSON next to the master image.

        Keyed by space_id: <master_dir>/{space_id}_baseline.json
        """
        import sys
        repo_root = Path(__file__).resolve().parents[4]
        if str(repo_root) not in sys.path:
            sys.path.insert(0, str(repo_root))

        from Pipeline.entrypoints.master_service import process_master_image

        process_master_image(
            image_input=str(master_image_path),
            room_name=space_id,
            prompt_name=prompt.name if prompt else None,
            prompt_instructions=prompt.prompt_text if prompt else None,
            output_baseline_dir=str(master_image_path.parent),
            export_annotated_dir=None,
        )