# Project Plan: National Weather Big Data Analytics Platform

## 1. Project Overview
A real-time multi-source weather intelligence and verification platform that aggregates official weather information, web information, social signals, and citizen observations, processes them using AI/ML, removes duplicates, verifies credibility, clusters reports into events, and visualizes verified weather intelligence on an interactive map.

## 2. Functional Requirements
* **Data Ingestion**: Collect reports from various sources (Citizen Portal, Mock API, CSV imports).
* **Normalization**: Convert disparate formats into a unified internal schema.
* **ML Classification**: Automatically classify the weather event category using NLP.
* **Duplicate Detection**: Identify similar reports based on space, time, text, and media.
* **Verification & Credibility**: Score reports based on corroboration, location consistency, source trust.
* **Event Clustering**: Group related reports into distinct weather events (e.g., #HYD-FLOOD-001).
* **Interactive Dashboard**: Display events on an India map, filter by various dimensions, show KPI cards.
* **Admin Panel**: Allow manual review of suspicious reports, merging of events, and auditing.
* **Citizen Reporting**: Public form to submit weather reports with location and media.

## 3. Non-Functional Requirements
* **Scalability**: Capable of handling high throughput (simulated via Kafka streaming).
* **Extensibility**: Easy to add new data source adapters.
* **Maintainability**: Clean monorepo structure, separated concerns.
* **Security**: JWT Auth, RBAC, environment variables, validation.
* **Demonstrability**: Must run locally without external APIs, using synthetic demo data.

## 4. MVP (Minimum Viable Product)
The MVP will focus on end-to-end functionality without complex external dependencies:
* FastAPI backend with PostgreSQL/PostGIS.
* React frontend with Leaflet Map and Recharts.
* Basic ML Classification (TF-IDF + Logistic Regression).
* Citizen Reporting Portal & Demo Data Generator.
* Rule-based Duplicate Detection (Distance + Time delta).
* Basic Event Clustering.
* Admin Panel for Review.

## 5. Advanced Features (Post-MVP)
* Full Apache Kafka integration for real-time streaming.
* Sentence Transformers / HuggingFace for advanced NLP.
* Image hashing for media duplicate detection.
* Real-world social media API integration (if accessible).

## 6. Development Phases
* **PHASE 0**: Analysis & Planning (Current Phase)
* **PHASE 1**: Foundation (Monorepo, Docker, DB, FastAPI, React)
* **PHASE 2**: Authentication (Admin Login, JWT)
* **PHASE 3**: Report Ingestion (Citizen portal, Demo data, Normalization)
* **PHASE 4**: ML Classification (Train model, Inference API)
* **PHASE 5**: Duplicate Detection (Spatiotemporal + Text rules)
* **PHASE 6**: Verification (Credibility scoring)
* **PHASE 7**: Event Clustering (Grouping reports)
* **PHASE 8**: Dashboard (Map, KPIs, Filters)
* **PHASE 9**: Admin Panel (Review queue, actions)
* **PHASE 10**: Real-Time Streaming (Kafka integration)
* **PHASE 11**: Testing & Hardening
* **PHASE 12**: Final Documentation & Academic Material
