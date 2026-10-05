# API Design

All endpoints are prefixed with `/api/v1`.

## Auth & Users
* `POST /auth/login` - Admin login, returns JWT token
* `GET /auth/me` - Get current admin user profile

## Public Dashboard
* `GET /dashboard/stats` - Get high-level KPIs (Total reports, verified, active events)
* `GET /dashboard/chart/time-series` - Get data for timeline charts
* `GET /dashboard/chart/distribution` - Get data for category/source distributions

## Reports
* `POST /reports/citizen` - Submit a new citizen report (public)
* `GET /reports` - List reports with filters (status, category, date, location)
* `GET /reports/{report_id}` - Get specific report details + verification evidence
* `PATCH /reports/{report_id}` - Update report status (admin only)

## Events
* `GET /events` - List weather events for the map + list view (with filters)
* `GET /events/{event_id}` - Get detailed event view with associated reports
* `PATCH /events/{event_id}` - Update event details (admin only)
* `POST /events/{event_id}/merge` - Merge two events (admin only)

## Admin Review & Verification
* `GET /admin/review-queue` - Get list of reports needing manual review
* `POST /admin/reports/{report_id}/verify` - Mark report as verified
* `POST /admin/reports/{report_id}/reject` - Mark report as rejected
* `GET /admin/audit-logs` - Get admin action logs

## Internal / ML
* `POST /ml/classify` - Classify raw text into a weather category
* `POST /ml/verify` - Run verification checks manually (for debugging)

## Ingestion (Internal/Worker usage)
* `POST /ingestion/raw` - Endpoint for generic webhook ingestions
* `POST /ingestion/demo/seed` - Trigger demo data generation
