# ElysiaJS + Prisma + PostgreSQL — User CRUD

A minimal ElysiaJS project exposing a User CRUD API backed by Prisma and PostgreSQL, with Swagger docs.

- Runtime: Bun (recommended) or Node
- Framework: ElysiaJS
- ORM: Prisma
- DB: PostgreSQL
- Docs: Swagger at `/docs`

## Quickstart

1) Copy env template and set variables

```
cp .env.example .env
```

Ensure `.env` contains:

```
DATABASE_URL=postgresql://elysia:elysia_pass@localhost:5432/elysia_db?schema=public
PORT=2070
```

2) Install dependencies

- With Bun:
```
bun install
```

- With Node (npm):
```
npm install
```

3) Generate Prisma Client and run migrations

- With Bun:
```
bunx prisma generate
bunx prisma migrate dev --name init
```

- With Node:
```
npx prisma generate
npx prisma migrate dev --name init
```

(Optional) Open Prisma Studio:
```
bunx prisma studio
# or: npx prisma studio
```

4) Start the API server

- With Bun (hot reload):
```
bun run dev
```

- With Node (tsx):
```
npm run dev:node
```

The server will start at:
- API base: http://localhost:2070
- Swagger UI: http://localhost:2070/docs

## Project Structure

```
biov2/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ index.ts              # Elysia app entry + Swagger
│  ├─ lib/
│  │  └─ prisma.ts         # PrismaClient singleton
│  └─ routes/
│     └─ users.ts          # User CRUD routes under /api/users
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md
```

## API Endpoints

Base path: `/api/users`

- GET `/api/users?skip=0&take=50`
- GET `/api/users/:id`
- POST `/api/users`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

### Example cURL

- Create
```
curl -X POST http://localhost:2070/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "age": 25,
    "phone": "+1-555-0100",
    "address": "123 Main St"
  }'
```

- List
```
curl "http://localhost:2070/api/users?skip=0&take=20"
```

- Get by ID
```
curl http://localhost:2070/api/users/USER_ID
```

- Update
```
curl -X PUT http://localhost:2070/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Updated",
    "email": "alice2@example.com",
    "age": 26,
    "phone": "+1-555-0101",
    "address": "456 Park Ave"
  }'
```

- Delete
```
curl -X DELETE http://localhost:2070/api/users/USER_ID
```

## Notes

- Ensure your local PostgreSQL has a database `elysia_db` and the user `elysia` with password `elysia_pass` can connect. Example (psql):
```
createdb elysia_db
# Create role and set password if needed, then grant privileges.
```
- If you change the database name/user/password, update `DATABASE_URL` in `.env`.
- Swagger docs derive from route schemas defined with `t.Object` in `src/routes/users.ts`.
