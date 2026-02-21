import React, { createContext, useState, useContext } from "react";

type CoinProps = {
  count: number;
  addCoins: () => void;
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
  CHARACTER: 5,
  KEYBOARD: 10,
};

const initialCoins = parseInt(localStorage.getItem("playerCoins") || "0");

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(initialCoins);

  const addCoins = () => {
    setCount((prev) => prev + DEFAULT_PER_LEVEL_REWARD);
    localStorage.setItem(
      "playerCoins",
      (count + DEFAULT_PER_LEVEL_REWARD).toString(),
    );
  };

  const payHints = (type: keyof typeof HINTS) => {
    setCount((prev) => Math.max(prev - HINTS[type], 0));
    localStorage.setItem(
      "playerCoins",
      Math.max(count - HINTS[type], 0).toString(),
    );
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
