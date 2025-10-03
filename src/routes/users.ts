import { Elysia, t } from 'elysia'
import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'

export const users = new Elysia({ prefix: '/api/users' })
  .get(
    '/',
    async ({ query }) => {
      const skip = query?.skip ?? 0
      const take = query?.take ?? 50
      const data = await prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } })
      const total = await prisma.user.count()
      return { data, pagination: { skip, take, total } }
    },
    {
      detail: { summary: 'List users', tags: ['Users'] },
      query: t.Object({
        skip: t.Optional(t.Integer({ minimum: 0 })),
        take: t.Optional(t.Integer({ minimum: 1, maximum: 100 }))
      })
    }
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const user = await prisma.user.findUnique({ where: { id: params.id } })
      if (!user) {
        set.status = 404
        return { error: 'User not found' }
      }
      return user
    },
    {
      detail: { summary: 'Get a user by ID', tags: ['Users'] },
      params: t.Object({ id: t.String({ format: 'uuid' }) })
    }
  )
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const user = await prisma.user.create({
          data: {
            name: body.name,
            email: body.email,
            age: body.age ?? null,
            phone: body.phone ?? null,
            address: body.address ?? null
          }
        })
        set.status = 201
        return user
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          set.status = 409
          return { error: 'Email already exists' }
        }
        throw e
      }
    },
    {
      detail: { summary: 'Create a user', tags: ['Users'] },
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        age: t.Optional(t.Integer({ minimum: 0 })),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String())
      })
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const user = await prisma.user.update({
          where: { id: params.id },
          data: {
            name: body.name,
            email: body.email,
            age: body.age ?? null,
            phone: body.phone ?? null,
            address: body.address ?? null
          }
        })
        return user
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            set.status = 409
            return { error: 'Email already exists' }
          }
          if (e.code === 'P2025') {
            set.status = 404
            return { error: 'User not found' }
          }
        }
        throw e
      }
    },
    {
      detail: { summary: 'Update user by ID', tags: ['Users'] },
      params: t.Object({ id: t.String({ format: 'uuid' }) }),
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        age: t.Optional(t.Integer({ minimum: 0 })),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String())
      })
    }
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        await prisma.user.delete({ where: { id: params.id } })
        return { success: true }
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
          set.status = 404
          return { error: 'User not found' }
        }
        throw e
      }
    },
    {
      detail: { summary: 'Delete user by ID', tags: ['Users'] },
      params: t.Object({ id: t.String({ format: 'uuid' }) })
    }
  )
