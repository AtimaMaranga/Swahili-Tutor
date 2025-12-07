import { NextRequest, NextResponse } from 'next/server';

/**
 * Create Daily.co Video Room
 * POST /api/video/create-room
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, studentId, tutorId } = await request.json();

    // Generate unique room name
    const roomName = `swahili-${sessionId.slice(0, 8)}-${Date.now().toString(36)}`;

    // In production, create room via Daily.co API
    // const response = await fetch('https://api.daily.co/v1/rooms', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.DAILY_API_SECRET}`,
    //   },
    //   body: JSON.stringify({
    //     name: roomName,
    //     privacy: 'private',
    //     properties: {
    //       enable_chat: true,
    //       enable_screenshare: true,
    //       enable_recording: false,
    //       start_video_off: false,
    //       start_audio_off: false,
    //       lang: 'sw', // Swahili locale
    //       max_participants: 2,
    //       exp: Math.floor(Date.now() / 1000) + 3600 * 4, // 4 hour expiry
    //     },
    //   }),
    // });

    // For development, return mock room data
    return NextResponse.json({
      roomName,
      roomUrl: `https://your-domain.daily.co/${roomName}`,
      token: `mock_token_${Date.now()}`,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create video room' },
      { status: 500 }
    );
  }
}

/**
 * Create Meeting Token for a user
 * POST /api/video/create-token
 */
export async function PUT(request: NextRequest) {
  try {
    const { roomName, userName, isOwner = false } = await request.json();

    // In production, create token via Daily.co API
    // const response = await fetch('https://api.daily.co/v1/meeting-tokens', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.DAILY_API_SECRET}`,
    //   },
    //   body: JSON.stringify({
    //     properties: {
    //       room_name: roomName,
    //       user_name: userName,
    //       is_owner: isOwner,
    //       enable_recording: false,
    //       exp: Math.floor(Date.now() / 1000) + 3600 * 4,
    //     },
    //   }),
    // });

    return NextResponse.json({
      token: `mock_token_${roomName}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Token creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting token' },
      { status: 500 }
    );
  }
}
