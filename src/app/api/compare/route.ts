import { NextRequest, NextResponse } from 'next/server';
import { getStandardGPUTelemetry } from '@/services/gpuService';

/**
 * Endpoint de API para simular o consultar la telemetría de una GPU estándar.
 * Delega la lógica de negocio al servicio de comparación GPU.
 */
export async function POST(req: NextRequest) {
  try {
    // Consultar las métricas de telemetría a través del servicio dedicado
    const metrics = await getStandardGPUTelemetry();

    return NextResponse.json({
      metrics,
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
