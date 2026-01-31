# React Native FinGuard

React Native mobile application for FinGuard AI - Your personal financial assistant.

## Features

- 💬 **Chat Assistant**: AI-powered financial advice and guidance
- 💰 **Budget Manager**: Track income, expenses, and spending by category
- 🏛️ **Scheme Lookup**: Discover and explore government financial schemes
- 👤 **Profile Management**: Manage your personal and financial information

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation (Stack + Bottom Tabs)
- **TanStack Query** for data fetching and caching
- **Lucide React Native** for icons
- Custom theme system matching web app design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
mobile/
├── src/
│   ├── navigation/        # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── Home/
│   │   ├── Auth/
│   │   ├── Chat/
│   │   ├── Budget/
│   │   ├── Schemes/
│   │   └── Profile/
│   ├── components/       # Reusable components
│   │   └── ui/          # Base UI components
│   ├── theme/           # Design tokens (colors, typography, spacing)
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── App.tsx              # Root component
└── package.json
```

## Design System

The app uses a custom design system with:
- **Colors**: Dark theme with amber primary and mint accent
- **Typography**: System fonts with defined sizes and weights
- **Spacing**: Consistent spacing scale (4px base)
- **Components**: Button, Input, Card with variants

## Screens

1. **Home**: Landing page with app introduction and features
2. **Auth**: Sign in / Sign up screen
3. **Chat**: AI chat assistant interface
4. **Budget**: Budget overview and category breakdown
5. **Schemes**: Government schemes search and listing
6. **Profile**: User profile and settings

## Development

- The app uses path aliases (`@/`) for cleaner imports
- All screens are typed with React Navigation types
- Theme tokens are centralized in `src/theme/`
- UI components follow a consistent API pattern

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
