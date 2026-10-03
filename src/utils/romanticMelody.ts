/**
 * Romantic Music Box Synthesizer (Fallback when /music/our-song.mp3 is not loaded)
 * Generates a warm, gentle music-box acoustic chime playing a romantic progression.
 */

let audioCtx: AudioContext | null = null;
let isPlayingMelody = false;
let timeoutId: number | null = null;

// Gentle romantic chords & melody in F Major (Tender, soothing)
// F, C/E, Dm, Bb, F/A, Gm7, C7, F
const melodyNotes: { freq: number; dur: number; delay: number }[] = [
  // Phrase 1
  { freq: 349.23, dur: 1.2, delay: 0 },    // F4
  { freq: 440.00, dur: 0.8, delay: 400 },  // A4
  { freq: 523.25, dur: 1.4, delay: 800 },  // C5
  { freq: 659.25, dur: 1.0, delay: 1400 }, // E5
  { freq: 587.33, dur: 1.6, delay: 1900 }, // D5
  { freq: 523.25, dur: 1.0, delay: 2600 }, // C5
  { freq: 466.16, dur: 1.4, delay: 3100 }, // Bb4
  { freq: 440.00, dur: 1.0, delay: 3700 }, // A4
  { freq: 392.00, dur: 1.8, delay: 4200 }, // G4
  { freq: 349.23, dur: 2.2, delay: 5000 }, // F4

  // Phrase 2 (Higher emotional octave)
  { freq: 523.25, dur: 1.0, delay: 6200 }, // C5
  { freq: 698.46, dur: 1.6, delay: 6700 }, // F5
  { freq: 659.25, dur: 1.2, delay: 7500 }, // E5
  { freq: 587.33, dur: 1.4, delay: 8100 }, // D5
  { freq: 523.25, dur: 1.6, delay: 8800 }, // C5
  { freq: 466.16, dur: 1.2, delay: 9600 }, // Bb4
  { freq: 523.25, dur: 1.4, delay: 10200 },// C5
  { freq: 349.23, dur: 2.8, delay: 11000 },// F4
];

function playChime(freq: number, duration: number, time: number) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // Bell/Music Box timbre
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);

  // Soft low-pass filter for warm bell tone
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 3, time);

  // Acoustic decay envelope
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.08, time + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + duration);
}

export function startRomanticMelody(): void {
  if (isPlayingMelody) return;
  isPlayingMelody = true;

  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  function loopSequence() {
    if (!isPlayingMelody || !audioCtx) return;
    const now = audioCtx.currentTime;

    melodyNotes.forEach((note) => {
      playChime(note.freq, note.dur, now + note.delay / 1000);
    });

    // Loop after 13.5 seconds
    timeoutId = window.setTimeout(loopSequence, 13500);
  }

  loopSequence();
}

export function stopRomanticMelody(): void {
  isPlayingMelody = false;
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
}
