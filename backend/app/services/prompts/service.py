from sqlalchemy import select
from sqlalchemy.orm import Session

from app.shared.db.models import Property
from app.shared.db.models import Prompt


class PromptService:
    def __init__(self, db: Session):
        self.db = db

    def get_prompts_by_property(
        self,
        property_id: str,
        user_id: str,
    ):
        if not user_id:
            raise PermissionError("Authenticated user is required.")

        if not property_id:
            raise ValueError("Property ID is required.")

        # Check property exists and belongs to authenticated user
        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )

        if property is None:
            raise LookupError("Property not found or access denied.")

        stmt = (
            select(Prompt)
            .where(Prompt.property_id == property_id)
            .order_by(Prompt.created_at.desc())
        )

        return self.db.scalars(stmt).all()

    def add_prompt(
        self,
        property_id: str,
        name:str,
        user_id: str,
        prompt_text: str,
    ):
        if not user_id:
            raise PermissionError("Authenticated user is required.")

        if not property_id:
            raise ValueError("Property ID is required.")

        if not prompt_text or not prompt_text.strip():
            raise ValueError("Prompt cannot be empty.")

        # Check property ownership
        property = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
                Property.owner_id == user_id,
            )
        )

        if property is None:
            raise LookupError("Property not found or access denied.")

        prompt = Prompt(
            property_id=property_id,
            name=name,
            prompt_text=prompt_text.strip(),
        )

        self.db.add(prompt)
        self.db.commit()
        self.db.refresh(prompt)

        return prompt