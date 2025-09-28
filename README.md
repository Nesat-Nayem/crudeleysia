# ElysiaJS User CRUD API

A modern, high-performance REST API built with ElysiaJS (Bun framework) and MongoDB Atlas for user management operations.

## Features

- 🚀 **High Performance** - Built on Bun runtime for exceptional speed
- 📚 **Swagger Documentation** - Interactive API documentation with Swagger UI
- 🗄️ **MongoDB Atlas** - Cloud-based MongoDB database
- 🔄 **Full CRUD Operations** - Create, Read, Update, Delete users
- ⚡ **Type-Safe** - Built with TypeScript for type safety
- 🌐 **CORS Enabled** - Cross-Origin Resource Sharing support
- 🚢 **Railway Ready** - Configured for deployment on Railway

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or later)
- MongoDB Atlas account and connection string

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd elysia-user-crud
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/database
PORT=3000
```

## Development

Run the development server with hot reload:
```bash
bun dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Swagger Documentation
- **GET** `/swagger` - Interactive API documentation

### Health Check
- **GET** `/` - API health check
- **GET** `/health` - Detailed health check with database status

### User CRUD Operations
- **POST** `/users` - Create a new user
- **GET** `/users` - Get all users (with pagination)
- **GET** `/users/:id` - Get user by ID
- **GET** `/users/email/:email` - Get user by email
- **PUT** `/users/:id` - Update user by ID (full update)
- **PATCH** `/users/:id` - Partially update user by ID
- **DELETE** `/users/:id` - Delete user by ID

## User Schema

```typescript
{
  _id?: ObjectId;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Request Examples

### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "phone": "+1234567890",
    "address": "123 Main St, City"
  }'
```

### Get All Users with Pagination
```bash
curl "http://localhost:3000/users?limit=10&skip=0"
```

### Update User
```bash
curl -X PUT http://localhost:3000/users/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

## Deployment on Railway

### Prerequisites
- Railway account
- Railway CLI installed (optional)

### Deployment Steps

1. Push your code to a GitHub repository

2. Connect to Railway:
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. Configure environment variables in Railway:
   - Add `MONGODB_URI` with your MongoDB connection string
   - Railway will automatically set the `PORT` variable

4. Deploy:
   - Railway will automatically deploy when you push to your main branch
   - Access your deployed API at the provided Railway URL

### Railway Configuration
The project is pre-configured for Railway deployment with:
- Bun runtime support
- Automatic port binding
- Production-ready settings

## Project Structure

```
elysia-user-crud/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── models/
│   │   └── user.model.ts     # User types and interfaces
│   ├── routes/
│   │   └── user.routes.ts    # User CRUD endpoints
│   ├── services/
│   │   └── user.service.ts   # Business logic
│   └── index.ts              # Main application
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Documentation
```

## Scripts

- `bun dev` - Start development server with hot reload
- `bun start` - Start production server
- `bun build` - Build for production
- `bun test` - Run tests

## Technologies Used

- **[Bun](https://bun.sh)** - JavaScript runtime & toolkit
- **[ElysiaJS](https://elysiajs.com)** - Fast & friendly Bun web framework
- **[MongoDB](https://www.mongodb.com)** - NoSQL database
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Swagger](https://swagger.io)** - API documentation

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Bun and ElysiaJS
