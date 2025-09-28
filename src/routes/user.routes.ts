import { Elysia, t } from 'elysia';
import { UserMongooseService } from '../services/user.mongoose.service';
import { checkDatabaseConnection } from '../middleware/db-check';

const userService = new UserMongooseService();

// Validation schemas
const createUserSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  email: t.String({ format: 'email' }),
  age: t.Optional(t.Number({ minimum: 0, maximum: 150 })),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String())
});

const updateUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  email: t.Optional(t.String({ format: 'email' })),
  age: t.Optional(t.Number({ minimum: 0, maximum: 150 })),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String())
});

const userResponseSchema = t.Object({
  _id: t.String(),
  name: t.String(),
  email: t.String(),
  age: t.Optional(t.Number()),
  phone: t.Optional(t.String()),
  address: t.Optional(t.String()),
  createdAt: t.String(),
  updatedAt: t.String()
});

export const userRoutes = new Elysia({ prefix: '/users' })
  // Create a new user
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const user = await userService.createUser(body);
        set.status = 201;
        return {
          success: true,
          message: 'User created successfully',
          data: user
        };
      } catch (error: any) {
        set.status = error.message.includes('already exists') ? 409 : 400;
        return {
          success: false,
          message: error.message || 'Failed to create user',
          data: null
        };
      }
    },
    {
      body: createUserSchema,
      detail: {
        summary: 'Create a new user',
        tags: ['Users']
      }
    }
  )
  // Get all users
  .get(
    '/',
    async ({ query }) => {
      try {
        const { limit, skip } = query;
        const users = await userService.getAllUsers(limit, skip);
        const total = await userService.getTotalCount();
        
        return {
          success: true,
          message: 'Users retrieved successfully',
          data: {
            users,
            total,
            limit: limit || 100,
            skip: skip || 0
          }
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to retrieve users',
          data: null
        };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number({ minimum: 1, maximum: 1000 })),
        skip: t.Optional(t.Number({ minimum: 0 }))
      }),
      detail: {
        summary: 'Get all users',
        tags: ['Users']
      }
    }
  )
  // Get user by ID
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const user = await userService.getUserById(params.id);
        
        if (!user) {
          set.status = 404;
          return {
            success: false,
            message: 'User not found',
            data: null
          };
        }
        
        return {
          success: true,
          message: 'User retrieved successfully',
          data: user
        };
      } catch (error: any) {
        set.status = error.message.includes('Invalid') ? 400 : 500;
        return {
          success: false,
          message: error.message || 'Failed to retrieve user',
          data: null
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get user by ID',
        tags: ['Users']
      }
    }
  )
  // Update user by ID
  .put(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const user = await userService.updateUser(params.id, body);
        
        if (!user) {
          set.status = 404;
          return {
            success: false,
            message: 'User not found',
            data: null
          };
        }
        
        return {
          success: true,
          message: 'User updated successfully',
          data: user
        };
      } catch (error: any) {
        set.status = error.message.includes('already exists') ? 409 : 
                     error.message.includes('Invalid') ? 400 : 500;
        return {
          success: false,
          message: error.message || 'Failed to update user',
          data: null
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: updateUserSchema,
      detail: {
        summary: 'Update user by ID',
        tags: ['Users']
      }
    }
  )
  // Partially update user by ID
  .patch(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const user = await userService.updateUser(params.id, body);
        
        if (!user) {
          set.status = 404;
          return {
            success: false,
            message: 'User not found',
            data: null
          };
        }
        
        return {
          success: true,
          message: 'User updated successfully',
          data: user
        };
      } catch (error: any) {
        set.status = error.message.includes('already exists') ? 409 : 
                     error.message.includes('Invalid') ? 400 : 500;
        return {
          success: false,
          message: error.message || 'Failed to update user',
          data: null
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: updateUserSchema,
      detail: {
        summary: 'Partially update user by ID',
        tags: ['Users']
      }
    }
  )
  // Delete user by ID
  .delete(
    '/:id',
    async ({ params, set }) => {
      try {
        const deleted = await userService.deleteUser(params.id);
        
        if (!deleted) {
          set.status = 404;
          return {
            success: false,
            message: 'User not found',
            data: null
          };
        }
        
        return {
          success: true,
          message: 'User deleted successfully',
          data: null
        };
      } catch (error: any) {
        set.status = error.message.includes('Invalid') ? 400 : 500;
        return {
          success: false,
          message: error.message || 'Failed to delete user',
          data: null
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Delete user by ID',
        tags: ['Users']
      }
    }
  )
  // Get user by email
  .get(
    '/email/:email',
    async ({ params, set }) => {
      try {
        const user = await userService.getUserByEmail(params.email);
        
        if (!user) {
          set.status = 404;
          return {
            success: false,
            message: 'User not found',
            data: null
          };
        }
        
        return {
          success: true,
          message: 'User retrieved successfully',
          data: user
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: error.message || 'Failed to retrieve user',
          data: null
        };
      }
    },
    {
      params: t.Object({
        email: t.String({ format: 'email' })
      }),
      detail: {
        summary: 'Get user by email',
        tags: ['Users']
      }
    }
  );
