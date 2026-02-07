# Scripts

Utility scripts for the Bulltrack monorepo.

## migrate-to-monorepo.sh

Helps migrate separate backend and frontend repositories into the current monorepo layout (e.g. into `apps/bulltrack-api` and `apps/bulltrack-web`). Adjust paths and branch names inside the script to match your repositories before running.

**Usage:**

```bash
./scripts/migrate-to-monorepo.sh
```

Run from the repository root. Ensure you have backups or a clean git state before running.
