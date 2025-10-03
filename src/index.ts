import 'dotenv/config'
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { users } from './routes/users'

const PORT = Number.parseInt(process.env.PORT || '2070', 10)

const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'User CRUD API',
          version: '1.0.0',
          description: 'ElysiaJS + Prisma + PostgreSQL'
        },
        tags: [{ name: 'Users', description: 'User CRUD operations' }]
      }
    })
  )
  .get('/', () => ({ status: 'ok', service: 'elysia-user-crud' }))
  .use(users)
  .listen({ port: PORT, hostname: '0.0.0.0' })

console.log(`🦊 Elysia running:  http://localhost:${PORT}`)
console.log(`📘 Swagger UI:     http://localhost:${PORT}/docs`)
