from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PromptCreateRequest(BaseModel):
    name: str
    promptText: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


class PromptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name:str
    prompt_text: str
    created_at: datetime