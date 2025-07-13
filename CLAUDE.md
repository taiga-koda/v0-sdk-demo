# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a v0-sdk based UI framework-specific component generator that uses Vercel's v0.dev API to generate components with strict framework enforcement. The key innovation is the configurable prompt engineering system that prevents mixed UI libraries and ensures framework-consistent output.

## Essential Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Package Manager
This project requires npm exclusively. Yarn and pnpm have compatibility issues with React 19 and Next.js 15.

## Architecture

### Core Technology Stack
- **Next.js 15.3.5** with App Router
- **React 19** 
- **v0-sdk 0.0.12** for AI component generation
- **TypeScript** for type safety
- **Material-UI v7.2.0** (when V0_UI_FRAMEWORK=mui)
- **Emotion** for MUI styling (SSR compatible)

### UI Framework Abstraction System

**Key Innovation**: Environment-driven framework selection with specialized prompt engineering.

**Core Files:**
- `src/lib/prompt-builder.ts` - Framework configuration and prompt generation
- `src/app/api/generate/route.ts` - Main generation endpoint with framework validation
- `src/app/api/framework/route.ts` - Framework information endpoint

**Framework Support Matrix:**
- `mui` - Material-UI with sx props and theme system
- `tailwind` - Utility-first CSS with semantic HTML
- `chakra` - Chakra UI component system
- `ant-design` - Ant Design enterprise components
- `react-bootstrap` - Bootstrap components for React
- `headless` - Headless UI + Tailwind combination

### Environment-Based Configuration

**Required Environment Variables:**
- `V0_API_KEY` - v0.dev API key (format: `v1:...`)
- `V0_UI_FRAMEWORK` - Framework selector (default: `mui`)
- `V0_MODEL_ID` - v0.dev model (default: `v0-1.5-sm`)
- `V0_CHAT_PRIVACY` - Chat privacy setting (default: `private`)

Copy `.env.example` to `.env.local` and configure appropriately.

### Prompt Engineering System

The `prompt-builder.ts` module contains framework-specific configurations with:
- **Framework-specific imports**: Proper import statements for each framework
- **Restrictions array**: Explicit rules preventing framework mixing
- **System messages**: Tailored AI instructions for each framework
- **Examples**: Framework-appropriate code samples

**Key Function:**
```typescript
buildEnhancedPrompt(userPrompt: string, framework: UIFramework): string
```

This function transforms user prompts into framework-specific instructions that prevent mixed library usage.

### v0-SDK Integration

**API Endpoint Pattern:**
```typescript
const chat = await v0.chats.create({
  modelConfiguration: { modelId: process.env.V0_MODEL_ID },
  chatPrivacy: process.env.V0_CHAT_PRIVACY,
  message: buildEnhancedPrompt(prompt, framework),
  system: getSystemMessage(framework)
});
```

**Response Format:**
- `chat.demo` - Preview URL for iframe embedding
- `chat.url` - Direct link to v0.dev chat
- `chat.files` - Generated code files array
- `chat.id` - Unique chat identifier

### Response Data Structure

v0-sdk APIs return structured data:
- `v0.chats.find()` returns `{object: 'list', data: ChatDetail[]}`
- `v0.projects.find()` returns `{object: 'list', data: ProjectDetail[]}`
- Always access the `data` property for actual arrays

### Application Structure

**Main Pages:**
- `/` - Component generator with framework-aware interface
- `/projects` - Chat history from v0.dev account

**API Routes:**
- `/api/generate` - Framework-specific component generation
- `/api/chats` - Chat history via v0.chats.find()
- `/api/framework` - Current framework configuration info

### MUI-Specific Architecture (Default Framework)

When `V0_UI_FRAMEWORK=mui`, the app uses:
- **Providers Setup**: `src/app/providers.tsx` wraps Emotion CacheProvider + MUI ThemeProvider
- **Emotion Cache**: `src/lib/emotion-cache.ts` for SSR compatibility
- **Theme System**: Custom MUI theme with Inter font family
- **CssBaseline**: Replaces traditional CSS resets

### Framework Switching Process

1. Update `V0_UI_FRAMEWORK` in `.env.local`
2. Restart development server
3. All generated components will use the new framework
4. API validates framework selection and returns appropriate errors for invalid values

### Type Safety

Framework selection is type-safe through:
- `UIFramework` union type in `prompt-builder.ts`
- Runtime validation via `isValidFramework()` function
- TypeScript compilation ensures valid framework references

### Error Handling

The generate API includes comprehensive validation:
- Prompt requirement validation
- Framework validity checking
- v0-sdk error propagation with detailed logging
- Environment variable validation

## Important Implementation Notes

### Framework Enforcement Strategy
The system prevents mixed frameworks through multiple layers:
1. **Prompt Enhancement**: Explicit framework requirements in user prompts
2. **System Messages**: AI instructions tailored to each framework
3. **Import Examples**: Framework-specific import patterns
4. **Restriction Lists**: Explicit prohibitions against other frameworks

### Preview System Limitations
v0.dev preview URLs may have CORS restrictions when embedded in iframes. The app provides fallback "Open in New Tab" buttons for reliable preview access.

### Package Manager Constraints
React 19 + Next.js 15 + v0-sdk combination only works reliably with npm. Document this clearly to users and provide troubleshooting steps for dependency conflicts.