import { NextResponse } from 'next/server';
import { getFrameworkConfig, isValidFramework } from '@/lib/prompt-builder';

export async function GET() {
  try {
    const uiFramework = process.env.V0_UI_FRAMEWORK || 'mui';
    
    if (!isValidFramework(uiFramework)) {
      return NextResponse.json(
        { error: `Invalid UI framework: ${uiFramework}` },
        { status: 400 }
      );
    }
    
    const config = getFrameworkConfig(uiFramework);
    
    return NextResponse.json({
      success: true,
      framework: uiFramework,
      name: config.name,
      examples: config.examples,
    });
  } catch (error) {
    console.error('Framework info error:', error);
    return NextResponse.json(
      { error: 'Failed to get framework info' },
      { status: 500 }
    );
  }
}