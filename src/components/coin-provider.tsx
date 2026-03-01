import { useState } from "react";
import { CoinContext, DEFAULT_PER_LEVEL_REWARD, HINTS } from "@/contexts/coin-context";

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
    return count - HINTS[type] >= 0;
  };

  return (
    <CoinContext.Provider value={{ count, addCoins, payHints, canBuyHints }}>
      {children}
    </CoinContext.Provider>
  );
};

export { DEFAULT_PER_LEVEL_REWARD, HINTS };
