/**
 * Procedural Cozy Audio Synthesizer utilizing the Web Audio API.
 * Synthesizes a warm Stardew Valley-inspired pentatonic chime progression.
 * Completely zero external sound assets or network overhead.
 */

let sharedAudioContext: AudioContext | null = null;

/**
 * Initializes or retrieves existing AudioContext instance upon user interaction.
 *
 * @returns Active AudioContext.
 */
function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioContextClass();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * Synthesizes a single bell/chime note with harmonic overtone and exponential decay.
 *
 * @param ctx - Active AudioContext.
 * @param frequency - Target pitch frequency in Hertz.
 * @param startTime - Scheduled playback onset time in seconds.
 * @param duration - Ring duration in seconds.
 */
function playChimeNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number = 1.2
): void {
  // Fundamental tone oscillator (Warm sine wave)
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Subtle overtone oscillator (Soft triangle wave)
  const overtoneOsc = ctx.createOscillator();
  const overtoneGain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, startTime);

  overtoneOsc.type = 'triangle';
  overtoneOsc.frequency.setValueAtTime(frequency * 2, startTime);

  // Attack and decay envelope
  gainNode.gain.setValueAtTime(0.001, startTime);
  gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  overtoneGain.gain.setValueAtTime(0.001, startTime);
  overtoneGain.gain.linearRampToValueAtTime(0.05, startTime + 0.03);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.7));

  osc.connect(gainNode);
  overtoneOsc.connect(overtoneGain);

  gainNode.connect(ctx.destination);
  overtoneGain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);

  overtoneOsc.start(startTime);
  overtoneOsc.stop(startTime + duration);
}

/**
 * Plays a tranquil, cozy pentatonic melody inspired by peaceful farm life in Stardew Valley.
 */
export function playCozyMelody(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Peaceful pentatonic frequencies (G4, B4, D5, E5, G5, B5)
    const melody = [
      { freq: 392.00, delay: 0.00, duration: 1.2 }, // G4
      { freq: 493.88, delay: 0.18, duration: 1.1 }, // B4
      { freq: 587.33, delay: 0.36, duration: 1.0 }, // D5
      { freq: 659.25, delay: 0.54, duration: 1.2 }, // E5
      { freq: 783.99, delay: 0.76, duration: 1.6 }, // G5
      { freq: 587.33, delay: 1.10, duration: 1.4 }, // D5 gentle resolve
    ];

    melody.forEach(({ freq, delay, duration }) => {
      playChimeNote(ctx, freq, now + delay, duration);
    });
  } catch (err) {
    console.warn('[CozyAudio] Audio synthesis not permitted without explicit user gesture:', err);
  }
}
