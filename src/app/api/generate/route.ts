import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const enhancedPrompt = `IMPORTANT: You must use Material-UI (MUI) components only. Do not use any other UI library.

Create a React component for: ${prompt}

Requirements:
- Use only @mui/material components (Box, Typography, Button, TextField, Paper, etc.)
- Import from '@mui/material' only
- Follow Material Design principles
- Include proper TypeScript types
- Make it responsive using MUI's sx prop and breakpoints
- Use MUI's theme system for colors and spacing
- No Tailwind CSS, no plain HTML elements for styling

Example imports:
import { Box, Typography, Button, TextField, Paper } from '@mui/material';`;

    const chat = await v0.chats.create({
      modelConfiguration: {
        modelId: process.env.V0_MODEL_ID as 'v0-1.5-sm' | 'v0-1.5-md' | 'v0-1.5-lg' || 'v0-1.5-sm',
      },
      chatPrivacy: (process.env.V0_CHAT_PRIVACY as 'private' | 'public') || 'private',
      message: enhancedPrompt,
      system: 'You are a React developer who ONLY uses Material-UI (MUI) components. You must never use any other UI library, Tailwind CSS, or plain HTML styling. Always import components from @mui/material and use the sx prop for styling. Follow Material Design principles strictly.',
    });

    console.log('Chat response:', {
      demo: chat.demo,
      url: chat.url,
      id: chat.id,
      files: chat.files
    });

    return NextResponse.json({
      success: true,
      previewUrl: chat.demo,
      chatUrl: chat.url,
      id: chat.id,
      files: chat.files || [],
    });
  } catch (error) {
    console.error('Generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate component', details: errorMessage },
      { status: 500 }
    );
  }
}