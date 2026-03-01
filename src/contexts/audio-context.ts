import { createContext } from "react";

export type AudioContextProps = {
  toggleMute: () => void;
  playButtonClick: () => void;
  playKeyPress: () => void;
  playSuccess: () => void;
  playFailure: () => void;
  playBGMenu: () => void;
  playBGGame: () => void;
  playHint: () => void;
  muted: boolean;
};

export const AudioContext = createContext<AudioContextProps | null>(null);
