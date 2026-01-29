# 🦋 MSN Messenger App

A nostalgic mobile messaging app inspired by the classic MSN Messenger from the 2000s. Built with React Native and Expo.

## Features

- ✅ Contact list with online/away/busy/offline status
- ✅ Custom status messages ("♪ Listening to...")
- ✅ Classic MSN-style color scheme
- ✅ **Nudge** feature with screen shake + haptics
- ✅ "is typing..." indicator
- ✅ Classic emoticon conversion (:) → 😊)
- ✅ Chat bubbles
- ✅ Settings screen

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo Go app on your phone (for testing)
- VS Code (recommended)

### Installation

1. **Open the project folder in VS Code**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
msn-messenger-app/
├── app/                    # Screens (Expo Router file-based routing)
│   ├── _layout.tsx         # Root layout with navigation
│   ├── index.tsx           # Home screen (contacts list)
│   ├── status.tsx          # Status selection modal
│   ├── settings.tsx        # Settings screen
│   └── chat/
│       └── [id].tsx        # Chat conversation screen
├── components/             # Reusable UI components
│   ├── ChatBubble.tsx
│   ├── ContactItem.tsx
│   ├── StatusIndicator.tsx
│   └── TypingIndicator.tsx
├── constants/
│   └── theme.ts            # Colors, typography, MSN emoticons
├── context/
│   └── UserContext.tsx     # User state management
├── assets/
│   ├── images/             # App icons, splash screen
│   └── sounds/             # Sound effects (add your own!)
├── hooks/                  # Custom React hooks
└── services/               # API/backend services (to implement)
```

## Next Steps

Here's what you might want to build next:

### 🔊 Add Sound Effects
Add the classic MSN sounds to `/assets/sounds/`:
- `message-received.mp3`
- `contact-online.mp3`
- `nudge.mp3`

Use `expo-av` to play them.

### 🔥 Add a Backend
Options for real-time messaging:
- **Firebase** - Easiest to set up
- **Supabase** - Open-source Firebase alternative
- **Socket.io** - For custom Node.js backend

### 🔐 Add Authentication
- Firebase Auth
- Supabase Auth
- Auth0

### 📱 Push Notifications
- `expo-notifications` for handling push notifications
- Firebase Cloud Messaging or Expo's push service

### 🎨 More MSN Features to Add
- [ ] Custom display pictures (avatars)
- [ ] Winks (animated emoticons)
- [ ] File sharing
- [ ] "Block" contacts
- [ ] Conversation history/search
- [ ] Group chats
- [ ] Custom backgrounds/themes

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform & tools
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **React Native Reanimated** - Smooth animations

## License

This project is for educational/nostalgic purposes. MSN Messenger was a trademark of Microsoft.

---

*Built with 🦋 nostalgia for the 2000s*
