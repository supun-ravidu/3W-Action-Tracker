'use client';

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

// Sound effects manager
class SoundEffects {
  private synth: Tone.Synth | null = null;
  private membrane: Tone.MembraneSynth | null = null;
  private metal: Tone.MetalSynth | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    await Tone.start();
    
    this.synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
    }).toDestination();

    this.membrane = new Tone.MembraneSynth().toDestination();
    this.metal = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();

    this.initialized = true;
  }

  playClick() {
    if (!this.synth) return;
    this.synth.volume.value = -10;
    this.synth.triggerAttackRelease('C5', '32n');
  }

  playSuccess() {
    if (!this.synth) return;
    this.synth.volume.value = -15;
    this.synth.triggerAttackRelease('C5', '16n');
    setTimeout(() => this.synth?.triggerAttackRelease('E5', '16n'), 100);
    setTimeout(() => this.synth?.triggerAttackRelease('G5', '8n'), 200);
  }

  playError() {
    if (!this.synth) return;
    this.synth.volume.value = -12;
    this.synth.triggerAttackRelease('E3', '16n');
    setTimeout(() => this.synth?.triggerAttackRelease('C3', '8n'), 100);
  }

  playHover() {
    if (!this.synth) return;
    this.synth.volume.value = -20;
    this.synth.triggerAttackRelease('A4', '64n');
  }

  playPop() {
    if (!this.membrane) return;
    this.membrane.volume.value = -15;
    this.membrane.triggerAttackRelease('C2', '32n');
  }

  playChime() {
    if (!this.metal) return;
    this.metal.volume.value = -20;
    this.metal.triggerAttackRelease('32n', 0.1);
  }

  dispose() {
    this.synth?.dispose();
    this.membrane?.dispose();
    this.metal?.dispose();
    this.initialized = false;
  }
}

// Global instance
let soundEffects: SoundEffects | null = null;

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!soundEffects) {
      soundEffects = new SoundEffects();
    }

    return () => {
      if (soundEffects) {
        soundEffects.dispose();
        soundEffects = null;
      }
    };
  }, []);

  const enable = async () => {
    if (!soundEffects) return;
    await soundEffects.init();
    setEnabled(true);
  };

  const playSound = (type: 'click' | 'success' | 'error' | 'hover' | 'pop' | 'chime') => {
    if (!enabled || !soundEffects) return;

    switch (type) {
      case 'click':
        soundEffects.playClick();
        break;
      case 'success':
        soundEffects.playSuccess();
        break;
      case 'error':
        soundEffects.playError();
        break;
      case 'hover':
        soundEffects.playHover();
        break;
      case 'pop':
        soundEffects.playPop();
        break;
      case 'chime':
        soundEffects.playChime();
        break;
    }
  };

  return { enabled, enable, playSound };
}

interface SoundButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  soundType?: 'click' | 'success' | 'pop';
  className?: string;
}

export function SoundButton({ 
  children, 
  onClick, 
  soundType = 'click',
  className 
}: SoundButtonProps) {
  const { enabled, enable, playSound } = useSoundEffects();

  const handleClick = async () => {
    if (!enabled) {
      await enable();
    }
    playSound(soundType);
    onClick?.();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export function SoundToggle() {
  const { enabled, enable, playSound } = useSoundEffects();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = async () => {
    if (!enabled) {
      await enable();
      playSound('success');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
      title={enabled ? 'Sound Effects Enabled' : 'Click to Enable Sound'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}

interface AmbientMusicPlayerProps {
  autoPlay?: boolean;
}

export function AmbientMusicPlayer({ autoPlay = false }: AmbientMusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = -25;

    const notes = ['C4', 'E4', 'G4', 'B4', 'D5', 'F#4', 'A4', 'C5'];
    
    const sequence = new Tone.Sequence(
      (time, note) => {
        synth.triggerAttackRelease(note, '8n', time);
      },
      notes,
      '4n'
    );

    sequenceRef.current = sequence;

    if (autoPlay) {
      Tone.start().then(() => {
        Tone.Transport.start();
        sequence.start(0);
        setPlaying(true);
      });
    }

    return () => {
      sequence.dispose();
      synth.dispose();
    };
  }, [autoPlay]);

  const toggle = async () => {
    await Tone.start();
    
    if (playing) {
      Tone.Transport.stop();
      sequenceRef.current?.stop();
      setPlaying(false);
    } else {
      Tone.Transport.start();
      sequenceRef.current?.start(0);
      setPlaying(true);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
      title={playing ? 'Pause Ambient Music' : 'Play Ambient Music'}
    >
      {playing ? '⏸️' : '▶️'}
    </button>
  );
}
