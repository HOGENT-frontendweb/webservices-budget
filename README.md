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

# CORS configuration
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=10800

# Database configuration
DATABASE_URL=mysql://devusr:devpwd@localhost:3306/budget

# Auth configuration
AUTH_JWT_SECRET=eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked
AUTH_JWT_AUDIENCE=budget.hogent.be
AUTH_JWT_ISSUER=budget.hogent.be
AUTH_HASH_LENGTH=32
AUTH_HASH_TIME_COST=6
AUTH_HASH_MEMORY_COST=65536
AUTH_MAX_DELAY=2000
```

## Start this project

### Development

- Install all dependencies: `pnpm install`
- Make sure a `.env` exists (see above)
- Create a database with the name given in the `.env` file
- Migrate the database: `pnpm db:migrate`
- Seed the database: `pnpm db:seed`
- Start the development server: `pnpm start:dev`

### Production

- Install all dependencies: `pnpm install`
- Make sure all environment variables are available in the environment
- Create a database with the name given in the environment variable
- Migrate the database: `pnpm db:migrate`
- Start the production server: `pnpm start`
