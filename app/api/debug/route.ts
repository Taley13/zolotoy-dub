import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    TELEGRAM_ADMIN_IDS: process.env.TELEGRAM_ADMIN_IDS,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? '***' + process.env.TELEGRAM_BOT_TOKEN.slice(-4) : 'NOT_SET',
    parsedAdminIds: process.env.TELEGRAM_ADMIN_IDS?.split(',').map(id => id.trim()),
    parsedChatIds: process.env.TELEGRAM_CHAT_ID?.split(',').map(id => id.trim()),
    hasOperators: !!(process.env.TELEGRAM_ADMIN_IDS || process.env.TELEGRAM_CHAT_ID),
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(debugInfo, { status: 200 });
}
