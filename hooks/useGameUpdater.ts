"use client";

import { produce } from "immer";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  gameStateAtom,
  purchasedUpgradesAtom,
  updateGameStateAtom,
} from "@/lib/atoms";

export function useGameUpdater() {
  const updateGameState = useSetAtom(updateGameStateAtom);
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [purchasedUpgrades] = useAtom(purchasedUpgradesAtom);
  // Update game state every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldShowSaveToast = updateGameState();
      const currentTime = Date.now(); // Decay click rate over time (if not clicking for 2 seconds, start decaying)
      const timeSinceLastClick =
        (currentTime - (gameState.lastClickTime || currentTime)) / 1000;
      if (timeSinceLastClick > 2 && (gameState.clickRate || 0) > 0) {
        setGameState(
          produce(gameState, (draft) => {
            // Ensure we have a valid clickRate
            draft.clickRate = gameState.clickRate || 0;

            // Decay by 10% every 100ms
            draft.clickRate *= 0.9;
            // Set to zero if very small to avoid tiny numbers
            if (draft.clickRate < 0.01) draft.clickRate = 0;
          })
        );
      }

      // Apply auto-click effect if the upgrade is purchased
      if (purchasedUpgrades.includes("auto_click")) {
        // Add 1 click per second = 0.1 per 100ms
        setGameState(
          produce(gameState, (draft) => {
            draft.money += 0.1;
          })
        );
      }

      // Show the save toast if needed
      if (shouldShowSaveToast) {
        toast.success("Game progress saved", {
          description:
            "Your game data is automatically saved to your browser's local storage.",
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [updateGameState, purchasedUpgrades, gameState, setGameState]);
}
