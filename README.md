# Campaign Manager

Full-stack monorepo to manage advertising campaigns and their associated creatives.

## Stack
- **Backend:** Laravel 13, PHP 8.4 (API-only)
- **Frontend:** React 19, Vite, TypeScript, Material UI

## Setup & Run

*Instructions to be populated as we build the Docker environment...*

## Custom Commands

### Import Campaigns
To populate the JSON data fixture from the original CSV file, you can run the following custom Artisan command:

```bash
# From the backend/ folder
php artisan app:import-campaigns
```
*(By default, this looks for `campaigns_data_2026.csv` in the project root and generates `backend/data/campaigns.json`)*

## Known Limitations & Future Enhancements
- **Delete Creative API:** Currently, the system supports uploading up to 3 creatives per campaign. However, there is no API endpoint to delete an existing creative. In a future iteration, a `DELETE /api/creatives/{id}` endpoint should be implemented to prevent campaigns from becoming permanently locked once the limit is reached.
