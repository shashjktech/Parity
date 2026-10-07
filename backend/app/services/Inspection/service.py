import logging
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.shared.db.enums import CaptureStatus, PropertyWorkerStatus
from app.shared.db.models import (
    Property,
    PropertyWorker,
    Space,
    MasterImage,
    Prompt,
    InspectionCapture,
    IssueTicket,
)
from app.shared.utils.inspection_image_storage import InspectionImageStorage
from app.services.spaces.service import SpaceService
from collections.abc import Sequence

logger = logging.getLogger(__name__)


class InspectionService:

    def __init__(
        self,
        db: Session,
        storage: InspectionImageStorage | None = None,
    ):
        self.db = db
        self.storage = storage or InspectionImageStorage()

    # ============================================================
    # INSPECTION CHECKLIST
    # ============================================================

    def get_inspection_checklist(
        self,
        user_id: str,
        property_id: str,
    ):
        # --------------------------------------------------------
        # 1. Verify worker is assigned to this property
        # --------------------------------------------------------

        assignment = self.db.scalar(
            select(PropertyWorker).where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.property_id == property_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )

        if assignment is None:
            return None

        # --------------------------------------------------------
        # 2. Get property
        # --------------------------------------------------------

        property_obj = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
            )
        )

        if property_obj is None:
            return None

        # --------------------------------------------------------
        # 3. Get all spaces belonging to this property
        # --------------------------------------------------------

        spaces = self.db.scalars(
            select(Space)
            .where(
                Space.property_id == property_id,
            )
            .order_by(
                Space.created_at.asc(),
            )
        ).all()

        # --------------------------------------------------------
        # 4. Get latest inspection capture for each space

        # --------------------------------------------------------

        spaces_with_captures = []

        for space in spaces:

            latest_capture = self.db.scalar(
                select(InspectionCapture)
                .where(
                    InspectionCapture.space_id == space.id,
                    InspectionCapture.worker_id == user_id,
                )
                .order_by(
                    InspectionCapture.capture_time.desc(),
                    InspectionCapture.created_at.desc(),
                )
                .limit(1)
            )

            spaces_with_captures.append(
                (
                    space,
                    latest_capture,
                )
            )

        return property_obj, spaces_with_captures

    # ============================================================
    # GET MASTER IMAGE
    # ============================================================

    def get_master_image_path(
        self,
        user_id: str,
        property_id: str,
        space_id: str,
    ):
        # --------------------------------------------------------
        # Verify worker assignment
        # --------------------------------------------------------

        assignment = self.db.scalar(
            select(PropertyWorker).where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.property_id == property_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )

        if assignment is None:
            raise PermissionError(
                "Worker is not assigned to this property."
            )

        # --------------------------------------------------------
        # Get property
        # --------------------------------------------------------

        property_obj = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
            )
        )

        if property_obj is None:
            raise LookupError(
                "Property not found."
            )

        # --------------------------------------------------------
        # Master image is owned/managed by the property owner
        # --------------------------------------------------------

        return SpaceService(self.db).get_master_image_path(
            property_id=property_id,
            space_id=space_id,
            user_id=property_obj.owner_id,
        )

    # ============================================================
    # SAVE INSPECTION CAPTURE
    # ============================================================

    def save_capture(
        self,
        user_id: str,
        property_id: str,
        space_id: str,
        content: bytes,
        content_type: str | None,
    ) -> InspectionCapture:

        # --------------------------------------------------------
        # 1. Verify worker assignment
        # --------------------------------------------------------

        if self._get_assignment(user_id, property_id) is None:
            raise PermissionError(
                "Worker is not assigned to this property."
            )

        # --------------------------------------------------------
        # 2. Verify space belongs to property
        # --------------------------------------------------------

        space = self.db.scalar(
            select(Space).where(
                Space.id == space_id,
                Space.property_id == property_id,
            ).with_for_update()
        )

        if space is None:
            raise LookupError(
                "Space not found for this property."
            )

        latest_capture = self.db.scalar(
            select(InspectionCapture)
            .where(
                InspectionCapture.space_id == space_id,
                InspectionCapture.worker_id == user_id,
            )
            .order_by(
                InspectionCapture.capture_time.desc(),
                InspectionCapture.created_at.desc(),
            )
            .limit(1)
            .with_for_update()
        )
        if latest_capture is not None and latest_capture.capture_status in (
            CaptureStatus.PENDING,
            CaptureStatus.PROCESSING,
            CaptureStatus.OK,
        ):
            raise FileExistsError(
                "A photo has already been submitted for this space."
            )

        # --------------------------------------------------------
        # 3. Save image to inspection storage
        # --------------------------------------------------------

        saved_image = self.storage.save_capture_image(
            property_id=property_id,
            space_id=space_id,
            content=content,
            content_type=content_type,
        )

        # --------------------------------------------------------
        # 4. Create InspectionCapture
        #
        # NO schedule_id.
        # --------------------------------------------------------

        capture = InspectionCapture(
            worker_id=user_id,
            space_id=space_id,
            capture_image_url=saved_image.as_posix(),
            capture_status=CaptureStatus.PROCESSING,
        )

        self.db.add(capture)

        # --------------------------------------------------------
        # 5. Save database record
        # --------------------------------------------------------

        try:
            self.db.flush()
            self.db.refresh(capture)
            self.db.commit()

        except Exception:
            logger.exception(
                "Capture save failed property_id=%s "
                "space_id=%s worker_id=%s",
                property_id,
                space_id,
                user_id,
            )

            self.db.rollback()

            # Delete uploaded file if database insertion fails
            saved_image.unlink(
                missing_ok=True,
            )

            raise

        return capture

    # ============================================================
    # GET CAPTURE IMAGE
    # ============================================================

    def get_capture_image_path(
        self,
        user_id: str,
        property_id: str,
        space_id: str,
        capture_id: str,
    ) -> Path:

        # --------------------------------------------------------
        # 1. Verify worker assignment
        # --------------------------------------------------------

        if self._get_assignment(user_id, property_id) is None:
            raise PermissionError(
                "Worker is not assigned to this property."
            )

        # --------------------------------------------------------
        # 2. Find capture
        #
        # Also verify that the space belongs to this property.
        # --------------------------------------------------------

        capture = self.db.scalar(
            select(InspectionCapture)
            .join(
                Space,
                Space.id == InspectionCapture.space_id,
            )
            .where(
                InspectionCapture.id == capture_id,
                InspectionCapture.space_id == space_id,
                Space.property_id == property_id,
            )
        )

        if capture is None or not capture.capture_image_url:
            raise LookupError(
                "Capture not found."
            )

        # --------------------------------------------------------
        # 3. Get allowed directory for this space
        # --------------------------------------------------------

        space_directory = (
            self.storage
            .get_space_directory(
                property_id,
                space_id,
            )
            .resolve()
        )

        # --------------------------------------------------------
        # 4. Resolve actual image path
        # --------------------------------------------------------

        image_path = Path(
            capture.capture_image_url
        ).resolve()

        # --------------------------------------------------------
        # 5. Security check
        #
        # Make sure capture image is actually inside the
        # expected space directory.
        # --------------------------------------------------------

        try:
            image_path.relative_to(
                space_directory
            )

        except ValueError as exc:
            raise LookupError(
                "Capture image is outside the space directory."
            ) from exc

        # --------------------------------------------------------
        # 6. Verify physical file exists
        # --------------------------------------------------------

        if not image_path.is_file():
            raise LookupError(
                "Capture image file not found."
            )

        return image_path

    def get_capture_result(
        self,
        user_id: str,
        property_id: str,
        space_id: str,
        capture_id: str,
    ) -> tuple[InspectionCapture, Sequence[IssueTicket]]:
        if self._get_assignment(user_id, property_id) is None:
            raise PermissionError("Worker is not assigned to this property.")

        capture = self.db.scalar(
            select(InspectionCapture)
            .join(Space, Space.id == InspectionCapture.space_id)
            .where(
                InspectionCapture.id == capture_id,
                InspectionCapture.space_id == space_id,
                InspectionCapture.worker_id == user_id,
                Space.property_id == property_id,
            )
        )
        if capture is None:
            raise LookupError("Inspection capture not found.")

        issues = self.db.scalars(
            select(IssueTicket)
            .where(IssueTicket.capture_id == capture_id)
            .order_by(IssueTicket.created_at.asc(), IssueTicket.id.asc())
        ).all()
        return capture, issues

    # ============================================================
    # SHARED WORKER ASSIGNMENT GUARD
    # ============================================================

    def _get_assignment(
        self,
        user_id: str,
        property_id: str,
    ):
        return self.db.scalar(
            select(PropertyWorker).where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.property_id == property_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )
        
    # run pipeline resolve input paths
    
    def resolve_pipeline_inputs(
        self,
        property_id: str,
        space_id: str,
        capture_id: str,
    ) -> dict:
        property_obj = self.db.scalar(select(Property).where(Property.id == property_id))
        if property_obj is None:
            raise LookupError("Property not found.")

        space = self.db.scalar(
            select(Space).where(Space.id == space_id, Space.property_id == property_id)
        )
        if space is None:
            raise LookupError("Space not found for this property.")

        capture = self.db.get(InspectionCapture, capture_id)
        if capture is None or capture.space_id != space_id:
            raise LookupError("Capture not found.")

        capture_path = Path(capture.capture_image_url).resolve()
        if not capture_path.is_file():
            raise LookupError("Capture image file not found.")

        # Reuses the existing verified resolution (owner context)
        master_path = SpaceService(self.db).get_master_image_path(
            property_id=property_id,
            space_id=space_id,
            user_id=property_obj.owner_id,
        )

        master_row = self.db.scalar(
            select(MasterImage)
            .where(MasterImage.property_id == property_id, MasterImage.space_id == space_id)
            .order_by(MasterImage.created_at.asc())
        )

        prompt_text = None
        if master_row is not None and master_row.prompt_id:
            prompt = self.db.get(Prompt, master_row.prompt_id)
            if prompt is not None:
                prompt_text = prompt.prompt_text
        # Missing prompt is NOT fatal: prompt_id is nullable by design;
        # the pipeline falls back to ALL mode.

        return {
            "capture": capture,
            "space": space,
            "current_image_path": capture_path,
            "master_image_path": master_path,
            "baseline_json_path": master_path.parent / f"{space_id}_baseline.json",
            "prompt_text": prompt_text,
            "annotated_dir": self.storage.get_space_directory(property_id, space_id) / "annotated",
        }