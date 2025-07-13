import { NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

export async function GET() {
  try {
    console.log('=== FETCHING CHATS FROM V0-SDK ===');
    console.log('API Key exists:', !!process.env.V0_API_KEY);
    
    // v0-sdkでチャット一覧を直接取得
    const chats = await v0.chats.find();
    
    console.log('=== RAW V0-SDK CHATS RESPONSE ===');
    console.log('Chats response:', JSON.stringify(chats, null, 2));
    console.log('Chats type:', typeof chats);
    console.log('Is array:', Array.isArray(chats));
    console.log('Response keys:', chats && typeof chats === 'object' ? Object.keys(chats) : 'N/A');

    // v0-sdkのChatsFindResponseに従ってdataプロパティを取得
    const chatsList = chats.data || [];

    console.log('Chats count:', chatsList.length);

    // 重複を除去
    const uniqueChats = chatsList.filter((chat, index, self) => 
      index === self.findIndex(c => c.id === chat.id)
    );

    console.log('Unique chats count:', uniqueChats.length);

    // チャット情報を整形
    const formattedChats = uniqueChats.map((chat: any) => {
      console.log('Processing chat:', chat);
      
      // 日付処理
      const createdAt = chat.createdAt || chat.created_at;
      const validDate = createdAt && !isNaN(new Date(createdAt).getTime()) 
        ? createdAt 
        : new Date().toISOString();
      
      return {
        id: chat.id,
        name: chat.title || chat.name || `Chat ${chat.id}`,
        description: chat.description || `Chat created on ${new Date(validDate).toLocaleDateString()}`,
        createdAt: validDate,
        chatCount: 1, // 各チャットは1つのチャット
        projectUrl: `https://v0.dev/chat/${chat.id}`,
        lastUpdated: chat.updatedAt || chat.updated_at || validDate
      };
    });

    return NextResponse.json({
      success: true,
      projects: formattedChats, // フロントエンドとの互換性のため"projects"キーを使用
      projectCount: formattedChats.length,
      debug: {
        originalType: typeof chats,
        isArray: Array.isArray(chats),
        originalChatsCount: chatsList.length,
        uniqueChatsCount: uniqueChats.length
      }
    });
  } catch (error) {
    console.error('Chats fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch chats', details: errorMessage },
      { status: 500 }
    );
  }
}