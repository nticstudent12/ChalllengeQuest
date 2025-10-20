# ChallengeQuest Frontend

A modern, responsive frontend for the ChallengeQuest GPS-based challenge platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** with glass-morphism design
- **Real-time Data** with React Query
- **Authentication** with JWT tokens
- **GPS Integration** for location-based challenges
- **Responsive Design** for all devices
- **Real-time Updates** with WebSocket support
- **Dark Theme** with custom design system
- **Component Library** with shadcn/ui

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (`hsl(263,70%,50%)`)
- **Secondary**: Cyan (`hsl(190,95%,50%)`)
- **Accent**: Orange (`hsl(40,100%,55%)`)
- **Success**: Green (`hsl(142,71%,45%)`)

### Components
- Glass-morphism cards with backdrop blur
- Gradient text effects
- Custom shadows and glows
- Responsive grid layouts

## 📱 Pages

- **Landing** - Marketing homepage
- **Login/Register** - Authentication
- **Dashboard** - Main user interface
- **Challenge Detail** - Individual challenge view
- **Leaderboard** - Global rankings
- **Admin Dashboard** - Challenge management

## 🔧 API Integration

The frontend uses a custom API client with React Query hooks:

```typescript
// Example usage
const { data: challenges, isLoading } = useChallenges();
const { login, isLoggingIn } = useAuth();
```

### Available Hooks
- `useAuth()` - Authentication operations
- `useProfile()` - User profile management
- `useChallenges()` - Challenge data
- `useUserChallenges()` - User's challenge progress
- `useLeaderboard()` - Leaderboard data
- `useJoinChallenge()` - Join challenge mutation
- `useSubmitStage()` - Submit stage completion

## 🎯 Key Features

### Authentication
- JWT token management
- Automatic token refresh
- Protected routes
- Login/logout functionality

### Challenge System
- Browse available challenges
- Join challenges
- Track progress
- Submit stage completions
- GPS location validation

### Real-time Updates
- Live leaderboard updates
- Challenge progress notifications
- WebSocket integration

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   └── ChallengeCard.tsx
├── hooks/             # Custom React hooks
├── lib/               # Utilities and API client
├── pages/             # Page components
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## 🎨 Styling

The app uses Tailwind CSS with custom design tokens:

```css
/* Custom CSS variables */
:root {
  --primary: 263 70% 50%;
  --secondary: 190 95% 50%;
  --accent: 40 100% 55%;
  --gradient-primary: linear-gradient(135deg, hsl(263 70% 50%), hsl(230 80% 55%));
}
```

## 🔧 Configuration

Key environment variables:
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy** the `dist` folder to your hosting service

## 🔒 Security

- JWT token storage in localStorage
- Automatic token refresh
- Protected API routes
- Input validation
- XSS protection

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- Code splitting with React.lazy
- Image optimization
- Efficient re-renders with React Query
- Optimized bundle size with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.