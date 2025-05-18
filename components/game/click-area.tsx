"use client";

import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { LucideCoins } from "lucide-react";
import { useState } from "react";

import { clickMoneyAtom } from "@/lib/atoms";

interface CoinAnimation {
  id: number;
  x: number;
  y: number;
  value: number;
}

export function ClickArea() {
  const clickMoney = useSetAtom(clickMoneyAtom);
  const [coinAnimations, setCoinAnimations] = useState<CoinAnimation[]>([]);

  const moneyPerClick = 1;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const result = clickMoney();

    const newCoin = {
      id: Date.now(),
      x,
      y,
      value: result || moneyPerClick,
    };

    setCoinAnimations((prev) => [...prev, newCoin]);
  };

  const removeAnimation = (id: number) => {
    setCoinAnimations((prev) => prev.filter((coin) => coin.id !== id));
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="w-full h-40 bg-muted rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
      >
        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <LucideCoins className="size-6 animate-bounce text-muted-foreground" />
          <p className="font-semibold text-muted-foreground text-sm">
            Start earning money by clicking!
          </p>
        </div>{" "}
        {coinAnimations.map((coin) => (
          <motion.div
            key={coin.id}
            className="absolute pointer-events-none"
            style={{
              // Position at the exact click point
              left: coin.x,
              top: coin.y,
              // Center the coin at the cursor position
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              opacity: 1,
              scale: 1,
            }}
            animate={{
              y: -100,
              opacity: 0,
              scale: 1.5,
            }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() => removeAnimation(coin.id)}
          >
            <div className="flex items-center gap-1 text-amber-500">
              <LucideCoins className="size-5" />
              <span className="font-bold text-sm">+${coin.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
