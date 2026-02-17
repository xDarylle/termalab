import { createContext, useRef, useState, useMemo, useCallback, useEffect } from 'react';

export type AudioContextProps = {
  toggleMute: () => void;
  playButtonClick: () => void;
  playKeyPress: () => void;
  playSuccess: () => void;
  playFailure: () => void;
  playBGMenu: () => void;
  playBGGame: () => void;
  muted: boolean;
};

export const AppAudioContext = createContext<AudioContextProps | null>(null);

const defaultMuted = localStorage.getItem('termalab-muted') === 'true';

// Helper for SFX objects to ensure preloading
const createSfx = (src: string) => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return audio;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [muted, setMuted] = useState(defaultMuted);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const bgMenuRef = useRef<HTMLAudioElement>(null);
  const bgGameRef = useRef<HTMLAudioElement>(null);

  const sfx = useMemo(() => ({
    buttonClick: createSfx('/audio/click.wav'),
    keyPress: createSfx('/audio/keypress.wav'),
    success: createSfx('/audio/success.wav'),
    failure: createSfx('/audio/fail.wav'),
  }), []);

  const playSfx = useCallback((sound: HTMLAudioElement) => {
    if (muted) return;
    sound.currentTime = 0;
    sound.play().catch(() => {}); 
  }, [muted]);

  const playBGMenu = useCallback(() => {
    if (bgMenuRef.current) {
      bgGameRef.current?.pause();
      bgMenuRef.current.muted = muted;
      bgMenuRef.current.play().catch(() => console.warn("BGM Menu: Play blocked by browser. Wait for click."));
    }
  }, [muted]);

  const playBGGame = useCallback(() => {
    if (bgGameRef.current) {
      bgMenuRef.current?.pause();
      bgGameRef.current.muted = muted;
      bgGameRef.current.play().catch(() => console.warn("BGM Game: Play blocked."));
    }
  }, [muted]);

  // AUTO-PLAY UNLOCKER: Browsers require a click before playing audio.
  useEffect(() => {
    const unlock = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        playBGMenu(); // Start music on first click
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
      }
    };
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [hasInteracted, playBGMenu]);

  const actions = useMemo(() => ({
    toggleMute: () => {
      const nextMuted = !muted;
      setMuted(nextMuted);
      localStorage.setItem('termalab-muted', String(nextMuted));
      
      // Update all active audio elements immediately
      Object.values(sfx).forEach(s => s.muted = nextMuted);
      if (bgMenuRef.current) bgMenuRef.current.muted = nextMuted;
      if (bgGameRef.current) bgGameRef.current.muted = nextMuted;
    },
    playButtonClick: () => playSfx(sfx.buttonClick),
    playKeyPress: () => playSfx(sfx.keyPress),
    playSuccess: () => {
      bgMenuRef.current?.pause();
      playSfx(sfx.success);
    },
    playFailure: () => {
      bgMenuRef.current?.pause();
      playSfx(sfx.failure);
    },
    playBGMenu,
    playBGGame,
    muted,
  }), [muted, sfx, playSfx, playBGMenu, playBGGame]);

  return (
    <AppAudioContext.Provider value={actions}>
      {children}
      <audio
        ref={bgMenuRef}
        src="/audio/bgm.mp3"
        loop
        muted={muted}
        onCanPlayThrough={(e) => (e.currentTarget.volume = 0.4)}
      />
      <audio
        ref={bgGameRef}
        src="/audio/bgm2.mp3"
        loop
        muted={muted}
        onCanPlayThrough={(e) => (e.currentTarget.volume = 0.4)}
      />
    </AppAudioContext.Provider>
  );
};
