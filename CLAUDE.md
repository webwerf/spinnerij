# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spinnerij Oosterveld — an Expo React Native mobile app showcasing a commercial building in Enschede, NL. Features a news feed (RSS), tenant directory (mock data), and contact info. Built for iOS, Android, and web.

## Development Commands

```bash
npx expo start          # Start dev server (press i for iOS, a for Android, w for Web)
npx expo start --ios    # Start on iOS simulator
npx expo start --android # Start on Android emulator
npx expo start --web    # Start in browser
```

No test runner or linter is configured.

## Architecture

- **Expo Router** with file-based routing (similar to Next.js App Router)
- **Tab navigation** with three tabs: Nieuws (news), Huurders (tenants), Contact
- **Modal routes** for detail screens: `artikel.tsx` (article detail), `huurder.tsx` (tenant detail)
- `app/(tabs)/index.tsx` redirects to `/nieuws`
- State is managed with React hooks only (no external state library)
- Custom hook `useRssFeed` fetches from RSS2JSON API

## Key Conventions

- **Language**: Dutch UI text, English code
- **Typography**: DM Sans font family (Regular 400, Medium 500, Bold 700)
- **Color palette** defined in `constants/Colors.ts`: primary green (#2D5E40), gold accent (#C8A96E), warm beige background (#F5F2ED)
- **Icons**: SF Symbols via `expo-symbols`
- **Styling**: React Native `StyleSheet.create` — no styled-components or NativeWind

## Key Dependencies

- Expo SDK 55 (canary), React 19, React Native 0.83
- `expo-router` for navigation
- `react-native-reanimated` for animations
- `react-native-web` for web support
- Typed routes enabled in `app.json`

## Deployment

- **Vercel**: linked project `spinnerij`, deploy via `./dev web` or manual `vercel deploy --prebuilt --prod`
- **Build**: `npx expo export --platform web` outputs to `dist/`, then copy to `.vercel/output/static/`
- **GitHub**: `wouterhendriks/spinnerij`
- SPA routing: Vercel config uses catch-all `{ "src": "/(.*)", "dest": "/index.html" }` for client-side routing

## Project Memory

- Expo Router Stack navigator does NOT animate on web — use `react-native-reanimated` entering animations (SlideInRight) directly on screen components instead
- iOS Safari bottom bar clips the tab bar — remove fixed `height` from tabBarStyle and use padding only, plus `viewport-fit=cover` in meta tag
- RSS feed via rss2json API: `item.content` has full HTML, `item.description` is short — use content for detail pages, description (stripped+truncated) for cards
- Vercel preview deploys are behind SSO on team accounts — use `--prod` for public URLs
