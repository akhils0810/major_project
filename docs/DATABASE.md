# Database Design

## 1. Relational Schema
The platform uses PostgreSQL with the PostGIS extension for spatial data processing.

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        string role
        timestamp created_at
    }

    SOURCES {
        uuid id PK
        string source_type
        string source_name
        string source_url
        float trust_score
        int total_reports
        int verified_reports
        int false_reports
        timestamp created_at
    }

    REPORTS {
        uuid id PK
        uuid source_id FK
        string external_id
        text content
        string media_url
        string media_type
        timestamp timestamp
        float latitude
        float longitude
        string state
        string city
        string event_category
        float confidence_score
        string verification_status
        boolean is_duplicate
        uuid duplicate_of FK
        uuid event_id FK
        timestamp created_at
        timestamp updated_at
    }

    EVENTS {
        uuid id PK
        string title
        string event_category
        string state
        string city
        float latitude
        float longitude
        timestamp start_time
        timestamp end_time
        string severity
        float confidence_score
        int report_count
        string verification_status
        timestamp created_at
        timestamp updated_at
    }

    VERIFICATION_RECORDS {
        uuid id PK
        uuid report_id FK
        float source_score
        float content_score
        float corroboration_score
        float location_score
        float media_score
        float final_score
        string decision
        uuid reviewed_by FK
        string review_reason
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid admin_id FK
        string action
        string entity_type
        uuid entity_id
        text details
        timestamp timestamp
    }

    SOURCES ||--o{ REPORTS : provides
    EVENTS ||--o{ REPORTS : groups
    REPORTS ||--o{ REPORTS : duplicates
    REPORTS ||--o{ VERIFICATION_RECORDS : undergoes
    USERS ||--o{ VERIFICATION_RECORDS : reviews
    USERS ||--o{ AUDIT_LOGS : performs
```

## 2. Geospatial Columns
* `latitude` and `longitude` are stored as floats.
* PostGIS `GEOMETRY(Point, 4326)` column will be added to `REPORTS` and `EVENTS` for fast spatial indexing and queries (e.g., `ST_DWithin`).
