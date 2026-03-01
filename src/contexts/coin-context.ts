import { createContext } from "react";

export const DEFAULT_PER_LEVEL_REWARD = 10;

export const HINTS = {
  CHARACTER: 10,
  KEYBOARD: 25,
};

export type CoinContextProps = {
  count: number;
  addCoins: (amount?: number) => void;
  payHints: (type: keyof typeof HINTS) => void;
  canBuyHints: (type: keyof typeof HINTS) => boolean;
};

export const CoinContext = createContext<CoinContextProps>({
  count: 0,
  addCoins: () => {},
  payHints: () => {},
  canBuyHints: () => false,
});
