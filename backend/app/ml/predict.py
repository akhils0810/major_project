import os
import joblib
import logging

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "weather_classifier.joblib")

# Global variable to hold the loaded model
_model = None

def load_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
            logger.info("ML model loaded successfully.")
        else:
            logger.warning(f"ML model not found at {MODEL_PATH}. Inference will return 'unknown'.")

def predict_category(text: str) -> dict:
    """
    Predicts the weather event category from the given text.
    Returns a dict with 'category' and 'confidence'.
    """
    if _model is None:
        load_model()
        
    if _model is None:
        return {"category": "unknown", "confidence": 0.0}
        
    try:
        # Pipeline expects an iterable of strings
        probabilities = _model.predict_proba([text])[0]
        categories = _model.classes_
        
        # Get the index of the highest probability
        best_idx = probabilities.argmax()
        category = categories[best_idx]
        confidence = float(probabilities[best_idx])
        
        # If it's very low confidence, fallback to unknown
        if confidence < 0.3:
            category = "unknown"
            
        return {
            "category": category,
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"category": "unknown", "confidence": 0.0}
