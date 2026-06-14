// Web Audio API Sound Synthesizer for summer pop and bell sounds
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a bubbly bubble-pop sound
 */
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Create oscillator and gain nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    // Quick pitch sweep up for bubble pop feel
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
    
    // Quick decay amplitude envelope
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (error) {
    console.warn("Could not play synthesized audio:", error);
  }
}

/**
 * Plays a whimsical light windchime/bell chime
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const playBell = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.05);
    };

    // Play a delightful multi-note glass windchime chord (major pentatonic)
    playBell(523.25, 0.0, 0.4);   // C5
    playBell(659.25, 0.05, 0.35); // E5
    playBell(783.99, 0.1, 0.3);   // G5
    playBell(987.77, 0.15, 0.25); // B5
    playBell(1046.5, 0.22, 0.2);  // C6
  } catch (error) {
    console.warn("Could not play synthesized chime:", error);
  }
}
