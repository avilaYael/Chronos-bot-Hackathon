import { useState, useRef, useCallback } from 'react';

interface UseRecorderProps {
  onLog?: (agent: 'System' | 'Error', text: string) => void;
  voiceEnabled?: boolean;
  speakText?: (text: string) => void;
}

/**
 * Custom Hook para gestionar el ciclo de vida del MediaRecorder sobre el Canvas de simulación.
 * Permite capturar la ejecución de la grilla en un video descargable WebM.
 */
export function useRecorder({ onLog, voiceEnabled, speakText }: UseRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * Inicia la captura del stream del canvas a 30 fps.
   */
  const startRecording = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      if (onLog) onLog('Error', 'No se encontró el lienzo Canvas de simulación para grabar.');
      return;
    }

    try {
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        if (onLog) onLog('Error', 'La captura del stream del canvas no es soportada por este navegador.');
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chronos-bot-demo-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        if (onLog) onLog('System', 'Grabación de video exportada y descargada.');
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      
      if (onLog) onLog('System', '🔴 Grabación de simulación en curso (Canvas 30fps).');
      if (voiceEnabled && speakText) {
        speakText('Grabación de simulación iniciada.');
      }
    } catch (err: any) {
      console.error('Error starting MediaRecorder in hook:', err);
      if (onLog) onLog('Error', `Fallo al iniciar el grabador: ${err.message}`);
    }
  }, [onLog, voiceEnabled, speakText]);

  /**
   * Detiene el flujo de grabación activa y dispara la descarga del archivo.
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (voiceEnabled && speakText) {
        speakText('Grabación de simulación detenida y procesada.');
      }
    }
  }, [voiceEnabled, speakText]);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
