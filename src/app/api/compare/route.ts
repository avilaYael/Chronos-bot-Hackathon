import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Wait for 1600ms to simulate the queue, scheduling, and slow execution on standard GPU architectures
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // 2. Generate typical low-performance metrics for a standard cloud GPU instance (e.g. NVIDIA T4 or slow startup VM)
    const latency = Math.round(1500 + Math.random() * 700); // 1500ms - 2200ms
    const ttft = Math.round(500 + Math.random() * 400);     // 500ms - 900ms
    const tokensPerSecond = Math.round(30 + Math.random() * 15); // 30 - 45 t/s

    return NextResponse.json({
      metrics: {
        latency,
        ttft,
        tokensPerSecond,
      }
    });

  } catch (error: any) {
    console.error('Error in api/compare route:', error);
    return NextResponse.json(
      { 
        error: 'Error interno en la ejecución de comparación de GPU', 
        details: error.message || String(error)
      }, 
      { status: 500 }
    );
  }
}
