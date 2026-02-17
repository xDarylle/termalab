import React, { createContext, useState, useContext } from "react";

type CoinProps = {
  count: number;
  addCoins: () => void;
  payHints: () => void;
};

export const CoinContext = createContext<CoinProps>({
  count: 0,
  addCoins: () => {},
  payHints: () => {},
});

export const DEFAULT_PER_LEVEL_REWARD = 10;
export const DEFAULT_HINT_COST = 5;

const initialCoins = parseInt(localStorage.getItem("playerCoins") || "0");

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(initialCoins);

  const addCoins = () => {
    setCount((prev) => prev + DEFAULT_PER_LEVEL_REWARD);
    localStorage.setItem("playerCoins", (count + DEFAULT_PER_LEVEL_REWARD).toString());
  };

  const payHints = () => {
    setCount((prev) => Math.max(prev - DEFAULT_HINT_COST, 0));
    localStorage.setItem("playerCoins", Math.max(count - DEFAULT_HINT_COST, 0).toString());
  };

  return (
    <CoinContext.Provider value={{ count, addCoins, payHints }}>
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
