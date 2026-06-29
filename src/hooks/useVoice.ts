import { useState, useCallback } from 'react';

/**
 * Custom Hook para gestionar el estado y la reproducción de la síntesis de voz (Web Speech API).
 * Permite narrar en tiempo real las decisiones y razonamientos del robot.
 */
export function useVoice() {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);

  /**
   * Sintetiza el texto provisto si el feedback de voz está habilitado.
   */
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancelar locuciones previas para evitar encolados largos
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.05; // Velocidad ligeramente acelerada
      utterance.pitch = 0.95; // Tono cyberpunk
      
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled]);

  /**
   * Alterna el estado de activación del feedback de voz.
   */
  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Sistemas de voz en línea.');
        utterance.lang = 'es-MX';
        window.speechSynthesis.speak(utterance);
      }
      return next;
    });
  }, []);

  return {
    voiceEnabled,
    speakText,
    toggleVoice,
  };
}
