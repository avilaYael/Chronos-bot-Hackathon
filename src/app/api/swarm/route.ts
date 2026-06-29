import { NextRequest, NextResponse } from 'next/server';
import { runSwarmPipeline } from '@/services/cerebrasService';

/**
 * Endpoint de API para la ejecución del enjambre de agentes lógicos.
 * Delega la lógica de negocio al servicio de Cerebras.
 */
export async function POST(req: NextRequest) {
  try {
    const { image, history, robotPos, gridSize = 10 } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Falta la imagen del mapa en formato Base64' }, { status: 400 });
    }

    if (!process.env.CEREBRAS_API_KEY) {
      return NextResponse.json({ error: 'CEREBRAS_API_KEY no está configurada en el servidor' }, { status: 500 });
    }

    // Ejecutar el pipeline secuencial de agentes a través del servicio
    const swarmResponse = await runSwarmPipeline(image, robotPos, gridSize, history);

    return NextResponse.json(swarmResponse);

  } catch (error: any) {
    console.error('Error in api/swarm route:', error);
    return NextResponse.json(
      { 
        error: 'Error interno en la ejecución del enjambre de agentes', 
        details: error.message || String(error)
      }, 
      { status: 500 }
    );
  }
}
