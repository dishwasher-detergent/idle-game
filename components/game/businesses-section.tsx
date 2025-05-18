"use client";

import { gameStateAtom } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import { ItemCard } from "./item-card";

export function BusinessesSection() {
  const gameState = useAtomValue(gameStateAtom);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Businesses</h2>
      <div className="space-y-4">
        {gameState.items.map((item) => (
          <ItemCard key={item.id} item={item} playerMoney={gameState.money} />
        ))}
      </div>
    </div>
  );
}
