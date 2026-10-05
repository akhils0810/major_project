import os
import json
import random
import joblib
from typing import List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "synthetic_weather_data.json")
MODEL_PATH = os.path.join(BASE_DIR, "model", "weather_classifier.joblib")

# Synthetic data generation logic
CATEGORIES = [
    "rainfall", "thunderstorm", "flooding", "heatwave", "fog", "dust_storm", "strong_winds", "unknown"
]

TEMPLATES = {
    "rainfall": [
        "Heavy rainfall observed here.", "Continuous rain for 2 hours.", 
        "Drizzling since morning.", "Sudden downpour.", "It is raining heavily."
    ],
    "thunderstorm": [
        "Loud thunder and lightning.", "Thunderstorm approaching.", 
        "Heavy storm with lightning strikes.", "Lots of lightning in the sky."
    ],
    "flooding": [
        "Streets are waterlogged.", "Severe flooding on the main road.", 
        "Water entered houses.", "Knee deep water on the streets."
    ],
    "heatwave": [
        "Unbearable heat today.", "Extremely hot weather.", 
        "Temperature above 45C.", "Scorching sun and heatwave."
    ],
    "fog": [
        "Zero visibility due to dense fog.", "Very foggy morning.", 
        "Thick fog on the highway.", "Can hardly see 10 meters ahead."
    ],
    "dust_storm": [
        "Massive dust storm.", "Can't see anything, too much dust.", 
        "Strong winds carrying dust.", "Sandstorm hitting the city."
    ],
    "strong_winds": [
        "Trees uprooted by strong winds.", "Very windy today.", 
        "Gale force winds.", "Winds are blowing extremely fast."
    ],
    "unknown": [
        "Nice weather today.", "Clear skies.", "Beautiful sunset.", 
        "Just a normal day.", "Nothing much to report here."
    ]
}

def generate_synthetic_dataset(num_samples: int = 1000) -> None:
    data = []
    for _ in range(num_samples):
        cat = random.choice(CATEGORIES)
        text = random.choice(TEMPLATES[cat])
        # Add some noise/variability
        if random.random() > 0.5:
            text = text.lower()
        if random.random() > 0.8:
            text = f"Report: {text}"
            
        data.append({"text": text, "label": cat})
        
    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    with open(DATASET_PATH, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Generated {num_samples} samples at {DATASET_PATH}")

def load_dataset() -> Tuple[List[str], List[str]]:
    with open(DATASET_PATH, 'r') as f:
        data = json.load(f)
    texts = [item["text"] for item in data]
    labels = [item["label"] for item in data]
    return texts, labels

def train_and_evaluate():
    print("Loading dataset...")
    X, y = load_dataset()
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training TF-IDF + Logistic Regression pipeline...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=1000)),
        ('clf', LogisticRegression(random_state=42, max_iter=1000))
    ])
    
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    print("\n--- Model Evaluation Metrics ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=CATEGORIES))
    
    print(f"Saving model to {MODEL_PATH}...")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print("Model saved successfully.")

if __name__ == "__main__":
    if not os.path.exists(DATASET_PATH):
        generate_synthetic_dataset(2000)
    train_and_evaluate()
