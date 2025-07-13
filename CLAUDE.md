# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a v0-sdk based MUI component generator that uses Vercel's v0.dev API to generate Material-UI React components. The application provides a web interface for generating, previewing, and managing MUI components with AI assistance.

## Essential Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Package Manager
This project requires npm. Yarn and pnpm have compatibility issues with React 19 and Next.js 15.

## Architecture

### Core Technology Stack
- **Next.js 15.3.5** with App Router
- **React 19** 
- **Material-UI (MUI) v7.2.0** for all UI components
- **v0-sdk 0.0.12** for AI component generation
- **Emotion** for MUI styling (required for MUI SSR)
- **TypeScript** for type safety

### Key Application Structure

**Main Pages:**
- `/` - Component generator interface with prompt input and preview tabs
- `/projects` - Chat history from v0.dev account

**API Routes:**
- `/api/generate` - Creates new MUI components via v0.chats.create()
- `/api/chats` - Fetches chat history via v0.chats.find()

### MUI Integration
The app uses a custom Providers setup (`src/app/providers.tsx`) that wraps:
- Emotion CacheProvider for SSR compatibility
- MUI ThemeProvider with custom theme
- CssBaseline for consistent styling

The emotion cache is configured in `src/lib/emotion-cache.ts` for proper SSR support.

### v0-SDK Configuration
When calling v0.chats.create(), the following configuration is required:
```typescript
{
  modelConfiguration: {
    modelId: 'v0-1.5-sm',
  },
  chatPrivacy: 'private',
  message: enhancedPrompt,
  system: systemMessage
}
```

### Environment Variables Required
- `V0_API_KEY` - API key for v0.dev (format: `v1:...`)
- `V0_MODEL_ID` - v0.dev model ID (default: `v0-1.5-sm`)
- `V0_CHAT_PRIVACY` - Chat privacy setting (default: `private`)

Copy `.env.example` to `.env.local` and configure these variables.

### Component Generation Strategy
The system enforces MUI-only usage through:
1. Enhanced prompts that explicitly require @mui/material components
2. System messages that prohibit other UI libraries
3. Specific examples of proper MUI imports and sx prop usage

### Response Format
v0-sdk APIs return structured responses:
- `v0.chats.find()` returns `{object: 'list', data: ChatDetail[]}`
- `v0.projects.find()` returns `{object: 'list', data: ProjectDetail[]}`
- Always access the `data` property for the actual array

### Preview System
The app provides dual preview options:
1. Iframe embedding of v0.dev preview URLs (may have CORS restrictions)
2. "Open in New Tab" fallback buttons for reliable preview access

## Important Implementation Notes

### MUI Enforcement
All generated components must use Material-UI exclusively. The prompt engineering specifically prohibits Tailwind CSS, plain HTML styling, and other UI frameworks.

### Error Handling
API routes include comprehensive error logging and structured error responses for debugging v0-sdk integration issues.

### TypeScript Configuration
The project uses strict TypeScript with proper typing for v0-sdk responses and MUI component props.