"""Bridge between the inspection-capture workflow and the Python Pipeline."""

from __future__ import annotations

import logging
import sys
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

# <repo>/backend/app/services/Inspection/pipeline_integration.py → repo root
_REPO_ROOT = Path(__file__).resolve().parents[4]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

# Model weights load once per process; serialize runs so concurrent captures
# don't race the lazy singletons or exhaust GPU/RAM.
_PIPELINE_LOCK = threading.Lock()


def _tickets_from_result(result, capture_id, space_id, property_id):
    from app.shared.db.models import IssueTicket


    tickets = []

    def add(title, description):
        tickets.append(
            IssueTicket(
                capture_id=capture_id,
                space_id=space_id,
                property_id=property_id,
                title=title[:255],
                description=description,
          
            )
        )

    for item in result.get("missing_items", []):
        add(
            f"Missing item: {item}",
            f"'{item}' is present in the master image but missing from the capture.",
        )
    for item in result.get("clutter_items", []):
        add(
            f"Unauthorized clutter: {item}",
            f"'{item}' appears in the capture but not in the master image.",
        )
    for alert in result.get("drift_alerts", []):
        add(
            f"Item drifted: {alert}",
            "Item moved beyond the allowed drift threshold vs. the master image.",
        )

    out_of_view = len(result.get("out_of_view_bulbs", []))
    lights_off = max(
        0, result.get("expected_bulbs", 0) - result.get("active_bulbs", 0) - out_of_view
    )
    if lights_off:
        add(
            f"{lights_off} light(s) off",
            f"{lights_off} of {result.get('expected_bulbs', 0)} fixtures were not active.",
        )

    return tickets


def run_capture_pipeline(capture_id: str, property_id: str, space_id: str) -> None:
    """Background task: run the pipeline for one stored capture and persist results.

    Never raises: every failure path ends in capture_status = FAILED.
    """
    from sqlalchemy import select

    from app.services.Inspection.service import InspectionService
    from app.shared.db.config.session import SessionLocal
    from app.shared.db.enums import CaptureStatus
    from app.shared.db.models import InspectionCapture, MasterImage, Prompt

    db = SessionLocal()
    try:
        inputs = InspectionService(db).resolve_pipeline_inputs(
            property_id, space_id, capture_id
        )
        capture = db.scalar(
            select(InspectionCapture).where(
                InspectionCapture.id == capture_id,
                InspectionCapture.space_id == space_id,
            )
        )

        if capture is None:
            raise LookupError(f"Inspection capture not found: capture_id={capture_id}")

        baseline_json: Path = inputs["baseline_json_path"]
        if not baseline_json.is_file():
            # Self-heal: build baseline from the master image if it's missing
            logger.warning("Baseline missing, regenerating: %s", baseline_json)
            master_row = db.scalar(
                select(MasterImage)
                .where(
                    MasterImage.property_id == property_id,
                    MasterImage.space_id == space_id,
                )
                .order_by(MasterImage.created_at.asc())
            )
            prompt = (
                db.get(Prompt, master_row.prompt_id)
                if master_row and master_row.prompt_id
                else None
            )
            from app.services.spaces.service import SpaceService

            SpaceService(db).generate_master_baseline(
                property_id,
                space_id,
                inputs["master_image_path"],
                prompt,
            )
        if not baseline_json.is_file():
            raise LookupError(f"Baseline could not be generated: {baseline_json}")

        annotated_dir: Path = inputs["annotated_dir"]
        annotated_dir.mkdir(parents=True, exist_ok=True)

        with _PIPELINE_LOCK:
            from Pipeline.entrypoints.inference_service import evaluate_worker_capture

            result = evaluate_worker_capture(
                current_image_input=str(inputs["current_image_path"]),
                master_image_path=str(inputs["master_image_path"]),
                baseline_json_path=str(baseline_json),
                room_name=space_id,
                prompt_text=inputs["prompt_text"],
                audit_mode="ALL",
                output_dir=str(annotated_dir),
                output_filename=f"{capture_id}_annotated.jpg",
            )

            logger.info(
                "Pipeline completed capture_id=%s room=%s verdict=%s "
                "ssim=%s active_bulbs=%s expected_bulbs=%s "
                "missing=%s clutter=%s drift=%s out_of_view=%s output_dir=%s",
                capture_id,
                space_id,
                result.get("verdict"),
                result.get("ssim_score"),
                result.get("active_bulbs"),
                result.get("expected_bulbs"),
                len(result.get("missing_items", [])),
                len(result.get("clutter_items", [])),
                len(result.get("drift_alerts", [])),
                len(result.get("out_of_view_bulbs", [])),
                "output_dir=%s" % annotated_dir,
            )

        verdict = result.get("verdict")
        if verdict not in ("OK", "REJECTED"):
            raise ValueError(f"Pipeline returned invalid result: {verdict!r}")
        if not Path(result.get("annotated_image_path") or "").is_file():
            raise OSError("Annotated output was not written.")

        if verdict == "REJECTED":
            db.add_all(_tickets_from_result(result, capture.id, space_id, property_id))
        # verdict == "OK" → room passed, no tickets

        capture.capture_status = (
            CaptureStatus.OK if verdict == "OK" else CaptureStatus.REJECTED
        )
        db.commit()
        logger.info("Pipeline done capture_id=%s verdict=%s", capture_id, verdict)

    except Exception as exc:
        logger.exception("Pipeline failed capture_id=%s", capture_id)
        try:
            db.rollback()
            capture = db.get(InspectionCapture, capture_id)
            if capture is not None:
                capture.capture_status = CaptureStatus.FAILED
                db.commit()
        except Exception:
            logger.exception("Failed to mark capture FAILED capture_id=%s", capture_id)
    finally:
        db.close()
