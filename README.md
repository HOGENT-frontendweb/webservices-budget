# webservices-budget

This is the backend used in lessons Web Services.

## Requirements

- [NodeJS v24 (LTS)](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/products/docker-desktop) (or MySQL server on your own device)

### Mysql
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html) (no Oracle account needed, click the tiny link below the grey box)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (no Oracle account needed, click the tiny link below the grey box)

## Start this project

### Before starting this project

Create a `.env` file with the following template.
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

### Development

- Install all dependencies: `pnpm install`
- Make sure a `.env` exists (see above)
- Create a database with the name given in the `.env` file
- Seed the database: `pnpm db:seed`
- Start the development server: `pnpm start:dev`

### Production

- Install all dependencies: `pnpm install`
- Make sure a `.env` exists (see above)
- Create a database with the name given in the environment variable
- Migrate the database: `pnpm db:migrate`
- Start the production server: `pnpm start`

## Test this project

## Before testing this project

Create a `.env.test` file with the following template.
Complete the environment variables with your secrets, credentials, etc.

```bash
# General configuration
NODE_ENV=testing
PORT=3000

# CORS configuration
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=10800

# Auth configuration
AUTH_JWT_SECRET=eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked
AUTH_JWT_AUDIENCE=budget.hogent.be
AUTH_JWT_ISSUER=budget.hogent.be
AUTH_HASH_LENGTH=32
AUTH_HASH_TIME_COST=6
AUTH_HASH_MEMORY_COST=65536
AUTH_MAX_DELAY=2000

LOG_DISABLED=true
```

### Running tests

This server will create the given database when the server is started.

- Install all dependencies: `pnpm install`
- Make sure `.env.test` exists (it's recommended to disabled logging in the testing environment)
- Run the tests: `pnpm test`
    - This will start a new server for each test suite that runs, you won't see any output as logging is disabled to make output more clean.
    - To enable logging change the config parameter `LOG_DISABLED` to `false`.
    - The user suite will take 'long' (around 6s) to complete, this is normal as many cryptographic operations are being performed.