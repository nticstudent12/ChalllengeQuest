# ChallengeQuest - Complete Platform Overview

## 🎯 Project Summary

ChallengeQuest is a comprehensive GPS-based challenge platform that combines real-world exploration with gamification. Users can join location-based challenges, complete stages by visiting GPS coordinates, and compete on global leaderboards.

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Authentication**: JWT token management

### Backend (Node.js + Express)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 🚀 Key Features

### Core Functionality

1. **User Authentication & Management**

   - JWT-based authentication
   - User profiles and statistics
   - Admin panel access

2. **Challenge System**

   - GPS-based challenges with multiple stages
   - Location validation and radius checking
   - QR code integration
   - Challenge categories and difficulty levels

3. **Progress Tracking**

   - Real-time progress updates
   - Stage completion tracking
   - XP and level system
   - Achievement system

4. **Leaderboards**

   - Global rankings
   - Time-based leaderboards (daily, weekly, monthly)
   - Real-time updates via WebSocket

5. **Admin Features**
   - Challenge creation and management
   - User management
   - Analytics and statistics

## 📊 Database Schema

### Core Entities

- **Users**: User accounts, profiles, XP, levels
- **Challenges**: Challenge definitions, categories, difficulty
- **Stages**: Individual challenge stages with GPS coordinates
- **ChallengeProgress**: User progress through challenges
- **StageProgress**: User progress through individual stages
- **Submissions**: User submissions for stages
- **Achievements**: Achievement definitions and user achievements
- **Leaderboard**: Ranking system
- **Notifications**: User notifications

### Relationships

- Users can have multiple ChallengeProgress records
- Challenges have multiple Stages
- ChallengeProgress has multiple StageProgress records
- Users can earn multiple Achievements

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Challenges

- `GET /api/challenges` - List challenges (with filters)
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges` - Create challenge (admin)
- `POST /api/challenges/join` - Join challenge
- `POST /api/challenges/submit-stage` - Submit stage completion
- `GET /api/challenges/user/my-challenges` - Get user's challenges

### Leaderboard

- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/stats` - Get statistics
- `GET /api/leaderboard/user-rank` - Get user's rank

## 🎨 Frontend Structure

### Pages

- **Landing**: Marketing homepage with features showcase
- **Login/Register**: Authentication forms
- **Dashboard**: Main user interface with challenge browsing
- **Challenge Detail**: Individual challenge view with map
- **Leaderboard**: Global rankings display
- **Admin Dashboard**: Challenge management interface

### Components

- **ChallengeCard**: Reusable challenge display component
- **UI Components**: Comprehensive shadcn/ui component library
- **Custom Hooks**: API integration hooks with React Query

### State Management

- **React Query**: Server state management
- **Local State**: Component-level state with useState
- **Authentication**: JWT token management

## 🔒 Security Features

### Backend Security

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection protection with Prisma

### Frontend Security

- JWT token storage
- Protected routes
- Input validation
- XSS protection

## 🌐 Real-time Features

### WebSocket Events

- Leaderboard updates
- Challenge progress notifications
- User notifications
- Admin announcements

### Real-time Updates

- Live leaderboard changes
- Challenge progress tracking
- User status updates

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Design System

- Glass-morphism cards
- Gradient text effects
- Custom shadows and glows
- Responsive grid layouts

## 🚀 Deployment

### Backend Deployment

1. Build TypeScript: `npm run build`
2. Set environment variables
3. Run database migrations
4. Start production server: `npm start`

### Frontend Deployment

1. Build for production: `npm run build`
2. Deploy `dist` folder to hosting service
3. Configure environment variables

## 🧪 Testing Strategy

### Backend Testing

- Unit tests for services
- Integration tests for API endpoints
- Database tests with Prisma

### Frontend Testing

- Component tests
- Integration tests
- E2E tests for user flows

## 📈 Performance Optimizations

### Backend

- Database query optimization
- Caching strategies
- Rate limiting
- Connection pooling

### Frontend

- Code splitting
- Image optimization
- Efficient re-renders
- Bundle optimization

## 🔄 Development Workflow

### Setup Process

1. Install dependencies: `npm install`
2. Configure environment variables
3. Set up database with Prisma
4. Run database migrations and seed
5. Start development servers

### Development Commands

- Backend: `npm run dev`
- Frontend: `npm run dev`
- Database: `npm run db:migrate`, `npm run db:seed`

## 📚 Documentation

### Available Documentation

- **Frontend README**: Component usage, styling, API integration
- **Backend README**: API endpoints, database schema, deployment
- **Setup Scripts**: Automated setup for both platforms
- **API Documentation**: Comprehensive endpoint documentation

## 🎯 Future Enhancements

### Planned Features

- Mobile app development
- Social features (friends, teams)
- Advanced analytics
- Payment integration
- Multi-language support
- Advanced GPS features

### Technical Improvements

- Microservices architecture
- Advanced caching
- CDN integration
- Performance monitoring
- Advanced security features

## 🤝 Contributing

### Development Guidelines

- Follow TypeScript best practices
- Use consistent code formatting
- Write comprehensive tests
- Document new features
- Follow security best practices

### Code Quality

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Getting Started

To get started with ChallengeQuest:

1. **Run the setup script**: `./setup.sh` (Linux/Mac) or `setup.bat` (Windows)
2. **Configure your database** in `backend/.env`
3. **Start the backend**: `cd backend && npm run dev`
4. **Start the frontend**: `npm run dev`
5. **Open your browser**: Navigate to `http://localhost:5173`

**Default admin credentials:**

- Email: `admin@challengequest.com`
- Password: `azerty`

Welcome to ChallengeQuest! 🚀
