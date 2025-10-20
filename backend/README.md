# ChallengeQuest Backend

A comprehensive backend API for the ChallengeQuest GPS-based challenge platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **JWT Authentication** with bcrypt password hashing
- **GPS-based Challenge System** with location validation
- **Real-time Leaderboards** with WebSocket support
- **File Upload System** for challenge submissions
- **Admin Panel** for challenge management
- **Comprehensive API** with full CRUD operations
- **Database Schema** with Prisma ORM
- **Rate Limiting** and security middleware
- **Error Handling** and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Challenge Endpoints
- `GET /api/challenges` - Get all challenges (with filters)
- `GET /api/challenges/:id` - Get challenge by ID
- `POST /api/challenges` - Create challenge (admin only)
- `POST /api/challenges/join` - Join a challenge
- `POST /api/challenges/submit-stage` - Submit stage completion
- `GET /api/challenges/user/my-challenges` - Get user's challenges

### Leaderboard Endpoints
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/stats` - Get leaderboard statistics
- `GET /api/leaderboard/user-rank` - Get user's rank

## 🗄️ Database Schema

The database includes the following main entities:
- **Users** - User accounts and profiles
- **Challenges** - Challenge definitions
- **Stages** - Individual challenge stages with GPS coordinates
- **ChallengeProgress** - User progress through challenges
- **StageProgress** - User progress through individual stages
- **Submissions** - User submissions for stages
- **Achievements** - Achievement system
- **Leaderboard** - Ranking system
- **Notifications** - User notifications

## 🔧 Configuration

Key environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - Frontend URL for CORS
- `UPLOAD_DIR` - Directory for file uploads

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection protection with Prisma

## 🌐 WebSocket Events

Real-time events for:
- Leaderboard updates
- Challenge progress notifications
- User notifications
- Admin announcements

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic
│   ├── types/          # TypeScript types
│   └── index.ts        # Main server file
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Database seed
└── uploads/            # File upload directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
