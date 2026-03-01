import React, { createContext, useState, useContext } from "react";

type CoinProps = {
  count: number;
  addCoins: (amount?: number) => void;
  payHints: (type: keyof typeof HINTS) => void;
  canBuyHints: (type: keyof typeof HINTS) => boolean
};

export const CoinContext = createContext<CoinProps>({
  count: 0,
  addCoins: () => {},
  payHints: () => {},
  canBuyHints: () => false
});

export const DEFAULT_PER_LEVEL_REWARD = 10;
export const HINTS = {
  CHARACTER: 10,
  KEYBOARD: 25,
};

const initialCoins = parseInt(localStorage.getItem("playerCoins") || "0");

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(initialCoins);

  const addCoins = (amount?: number) => {
    const coinsToAdd = amount ?? DEFAULT_PER_LEVEL_REWARD;
    setCount((prev) => {
      const newCount = prev + coinsToAdd;
      localStorage.setItem("playerCoins", newCount.toString());
      return newCount;
    });
  };

  const payHints = (type: keyof typeof HINTS) => {
    setCount((prev) => {
      const newCount = Math.max(prev - HINTS[type], 0);
      localStorage.setItem("playerCoins", newCount.toString());
      return newCount;
    });
  };

  const canBuyHints = (type: keyof typeof HINTS) => {
    return count - HINTS[type] >= 0
  }

  return (
    <CoinContext.Provider value={{ count, addCoins, payHints, canBuyHints }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  if (!useContext(CoinContext)) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return useContext(CoinContext);
};
