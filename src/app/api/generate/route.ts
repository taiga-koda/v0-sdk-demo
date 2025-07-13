import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';
import { buildEnhancedPrompt, getSystemMessage, isValidFramework } from '@/lib/prompt-builder';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get UI framework from environment variable
    const uiFramework = process.env.V0_UI_FRAMEWORK || 'mui';
    
    if (!isValidFramework(uiFramework)) {
      return NextResponse.json(
        { error: `Invalid UI framework: ${uiFramework}. Supported frameworks: mui, tailwind, chakra, ant-design, react-bootstrap, headless` },
        { status: 400 }
      );
    }
    
    const enhancedPrompt = buildEnhancedPrompt(prompt, uiFramework);

    const chat = await v0.chats.create({
      modelConfiguration: {
        modelId: process.env.V0_MODEL_ID as 'v0-1.5-sm' | 'v0-1.5-md' | 'v0-1.5-lg' || 'v0-1.5-sm',
      },
      chatPrivacy: (process.env.V0_CHAT_PRIVACY as 'private' | 'public') || 'private',
      message: enhancedPrompt,
      system: getSystemMessage(uiFramework),
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