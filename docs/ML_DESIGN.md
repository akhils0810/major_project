# ML Pipeline Design

## 1. Objectives
1. **Event Classification**: Assign a category (e.g., `flooding`, `heatwave`) to incoming raw text.
2. **Duplicate Detection**: Identify when multiple reports describe the exact same observation.
3. **Verification/Credibility Scoring**: Calculate a 0-100 score based on multiple signals.
4. **Event Clustering**: Group related verified reports into distinct real-world events.

## 2. Event Classification
* **Input**: Raw text (e.g., "Water levels rising near Kukatpally main road")
* **Output**: `{ "category": "flooding", "confidence": 0.88 }`
* **Approach**: 
  - **MVP**: TF-IDF Vectorizer + Logistic Regression trained on a custom synthetic dataset.
  - **Advanced**: Pre-trained Sentence Transformers or BERT fine-tuned for classification.

## 3. Duplicate Detection
* **Approach**: 
  - Compare new report against recent (last 24 hours) reports in the same geographic vicinity (e.g., 2km radius using PostGIS).
  - Calculate Text Similarity using Cosine Similarity on TF-IDF vectors (or Sentence Embeddings).
  - If Time Delta < threshold AND Distance < threshold AND Text Similarity > threshold, mark as Duplicate.

## 4. Verification & Credibility Scoring
A rule-based scoring system combining multiple signals:
* **Source Trust (0-100)**: Pre-defined for APIs/News. Dynamic for citizens based on past accepted reports.
* **Corroboration Score**: Increases by 10 points for every independent report of the same category within a 10km/2h window.
* **Content Integrity**: Check for spam keywords, all-caps, minimal length.
* **Total Score Calculation**: Weighted average of the above.
* **Decision Thresholds**:
  - `> 80`: VERIFIED
  - `60 - 80`: LIKELY_TRUE
  - `40 - 60`: NEEDS_REVIEW (Send to Admin)
  - `< 40`: LIKELY_FALSE

## 5. Event Clustering
* **Approach**: Spatiotemporal clustering using a variant of DBSCAN or simple greedy radius clustering.
* **Process**: 
  - When a VERIFIED report comes in, search for active EVENTS matching the category within X km and active within the last Y hours.
  - If found, attach report to the EVENT and update event bounds/time.
  - If not found, create a NEW EVENT.
