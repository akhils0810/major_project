from pydantic import BaseModel
from fastapi import APIRouter
from app.ml.predict import predict_category

router = APIRouter()

class ClassifyRequest(BaseModel):
    text: str

class ClassifyResponse(BaseModel):
    category: str
    confidence: float

@router.post("/classify", response_model=ClassifyResponse)
def classify_text(request: ClassifyRequest):
    """
    Classify a raw text string into a weather event category.
    """
    prediction = predict_category(request.text)
    return ClassifyResponse(
        category=prediction["category"],
        confidence=prediction["confidence"]
    )
