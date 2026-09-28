/**
 * Audio Synthesizer & Narration Player
 * Uses Web Speech API (speechSynthesis) to speak real commentary synchronized
 * with tour steps, with fallback visual audio wave visualization and captions.
 */

class AudioNarrationService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private onStateChange: ((isPlaying: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public speak(text: string, onEnd?: () => void): void {
    if (this.synth) {
      this.synth.cancel();
    }

    if (this.isMuted || !this.synth) {
      if (onEnd) {
        // Fallback timer when muted
        setTimeout(onEnd, 8000);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick best English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    if (this.onStateChange) this.onStateChange(true);
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    if (this.onStateChange) this.onStateChange(false);
  }

  public subscribe(cb: (isPlaying: boolean) => void): () => void {
    this.onStateChange = cb;
    return () => {
      this.onStateChange = null;
    };
  }
}

export const audioNarrationService = new AudioNarrationService();
