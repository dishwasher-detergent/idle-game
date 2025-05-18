"use client";

import { gameStateAtom, totalIncomeAtom } from "@/lib/atoms";
import { formatMoney } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ResetGameButton } from "./reset-game-button";

export function GameHeader() {
  const gameState = useAtomValue(gameStateAtom);
  const totalIncome = useAtomValue(totalIncomeAtom);

  return (
    <div className="bg-card rounded-lg p-6 mb-8 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Idle Money Maker</h1>{" "}
          <div className="flex gap-4">
            <div className="text-2xl font-semibold">
              ${formatMoney(gameState.money || 0)}
            </div>
          </div>
          <p className="text-green-500 font-semibold">
            +${formatMoney(isNaN(totalIncome) ? 0 : totalIncome)}/sec
          </p>
          {(gameState.clickRate || 0) > 0 && (
            <div className="text-xs text-muted-foreground mt-1 font-semibold">
              +$
              {formatMoney(
                isNaN(gameState.clickRate) ? 0 : gameState.clickRate
              )}
              /sec clicks
            </div>
          )}
        </div>
        <div>
          <ResetGameButton />
        </div>
      </div>
    </div>
  );
}
