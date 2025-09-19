# webservices-budget

This is the backend used in lessons Web Services.

## Requirements

- [NodeJS v22 (LTS)](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html) (no Oracle account needed, click the tiny link below the grey box)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (no Oracle account needed, click the tiny link below the grey box)

## Before starting this project

Create a `.env` (development) file with the following template.
Complete the environment variables with your secrets, credentials, etc. 

```bash
# General configuration
NODE_ENV=development
PORT=3000
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=10800
```

## Start this project

### Development

- Install all dependencies: `pnpm install`
- Start the development server: `pnpm start:dev`

### Production

- Install all dependencies: `pnpm install`
- Start the production server: `pnpm start`
