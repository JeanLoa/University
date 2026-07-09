# Changelog

## 3.0.0 - 2026-07-01

### Changed

- Aligned the frontend release metadata for the current LowCortisol delivery.
- Removed the production risk of falling back to localhost when the API base URL is missing.

### Verification

- `npm run build`

## 2.0.0 - 2026-06-20

### Added

- Workplace physical model with sites, rooms, groups, assignments and location picker.
- Device control surfaces for valves, sensors, operations and conduits.
- Monitoring dashboard with readings, thresholds, savings insights and consumption reports.
- Notification response center with alerts, incidents, actions, mitigation and channels.
- Plan capacity controls, checkout flow and operational limits.
- Support tickets, knowledge articles and article detail views.
- Profile editing, operational settings, about page and shared navigation surfaces.
- Shared UI foundation, local fallback data services, audit scripts and multilingual copy.

### Changed

- Updated development API target to local backend defaults.
- Reworked global layout, bottom navigation, cards, modals, date range and select controls.
- Removed obsolete exported frontend artifacts and legacy diagram files from the frontend repo.

### Verification

- `npm install`
- `npm run build`
