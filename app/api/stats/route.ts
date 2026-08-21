import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
let statsData = [
  { label: 'Works Done', target: 100 },
  { label: 'Happy Clients', target: 150 },
  { label: 'Countries', target: 20 },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { stats: statsData }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stats } = body;

    if (!stats || !Array.isArray(stats)) {
      return NextResponse.json(
        { success: false, message: 'Invalid stats data' },
        { status: 400 }
      );
    }

    statsData = stats;

    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      data: { stats: statsData }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update stats' },
      { status: 500 }
    );
  }
}