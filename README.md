# RepLoop

A fitness tracking mobile app built with React Native and Expo. Track workouts, monitor progress, and get personalized recommendations.

## Features

- **Workout Management** - Create custom workout programs, add exercises with sets/reps/weight configuration
- **Live Session Tracking** - Real-time workout logging with rest timers, set-by-set tracking, and session pause/resume
- **Progress Analytics** - Personal records, strength progress charts, and body measurement tracking
- **Smart Recommendations** - ML-powered workout suggestions based on your profile, goals, and experience level
- **User Profiles** - Onboarding wizard, avatar upload, and customizable settings
- **Authentication** - Email/password login, Google and Apple OAuth, JWT with refresh tokens

## Tech Stack

- **Framework:** React Native 0.83 + Expo 55
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **State:** React Context (Auth, User, Settings)
- **Animations:** React Native Reanimated, Gesture Handler
- **Storage:** Expo Secure Store (tokens)
- **UI:** Custom dark theme with glass-morphism effects

## Getting Started

### Prerequisites

- Node.js 18+
- iOS Simulator (macOS) or Android Emulator
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Clone the repository
git clone https://github.com/AUlasEren/RepLoop.git
cd RepLoop

# Install dependencies
npm install

# Start the development server
npm start
```

Scan the QR code with Expo Go or press `i` for iOS simulator / `a` for Android emulator.

## Project Structure

```
src/
├── app/                  # Screens (file-based routing)
│   ├── (auth)/           # Login, Register, Profile Setup
│   └── (tabs)/           # Home, Workouts, Add, Statistics, Profile
├── components/           # Reusable UI components
├── features/             # Feature-specific components
├── services/             # API client and service layer
├── store/                # Context providers (Auth, User, Settings)
├── constants/            # Theme colors, API config
└── hooks/                # Custom React hooks
```

## API

The app connects to a backend REST API with the following modules:

| Module | Description |
|--------|-------------|
| Auth | Login, register, OAuth, token refresh |
| User | Profile management, avatar upload |
| Workouts | CRUD operations, workout history |
| Exercises | Browse/filter exercises by muscle group, equipment, difficulty |
| Sessions | Start, track, pause, complete workout sessions |
| Statistics | Personal records, strength progress, body measurements |
| Recommendations | Personalized workout suggestions |
| Settings | Workout, notification, and privacy preferences |

## License

This project is proprietary. All rights reserved.
