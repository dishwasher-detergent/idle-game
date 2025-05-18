import { produce } from "immer";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";

import { SHOPS } from "@/constants/shop.constants";
import { UPGRADES } from "@/constants/upgrade.constants";
import { GameItem, GameState, GlobalState } from "@/interfaces/game.interface";

const initialGameState: GameState = {
  money: 10,
  lastUpdate: Date.now(),
  incomePerSecond: 0,
  items: SHOPS,
  clickCount: 0,
  clickRate: 0,
  lastClickTime: Date.now(),
};

const initialGlobalState: GlobalState = {
  gameData: initialGameState,
  purchasedUpgrades: [],
  unlockedAchievements: [],
};

// Single atom for the entire game state
export const globalStateAtom = atomWithStorage<GlobalState>(
  "idleGameGlobalState",
  initialGlobalState
);

// Focus atoms for different parts of the state
export const gameStateAtom = focusAtom(globalStateAtom, (optic) =>
  optic.prop("gameData")
);
export const purchasedUpgradesAtom = focusAtom(globalStateAtom, (optic) =>
  optic.prop("purchasedUpgrades")
);
export const achievementsAtom = focusAtom(globalStateAtom, (optic) =>
  optic.prop("unlockedAchievements")
);

export const calculateItemPrice = (item: GameItem): number => {
  return Math.floor(item.baseCost * Math.pow(1.15, item.count));
};

export const calculateUpgradePrice = (item: GameItem): number => {
  return Math.floor(item.baseCost * item.upgradeCostMultiplier * item.level);
};

export const calculateItemIncome = (item: GameItem): number => {
  return (
    item.baseIncome *
    item.count *
    Math.pow(item.upgradeMultiplier, item.level - 1)
  );
};

export const calculateTotalIncome = (items: GameItem[]): number => {
  return items.reduce((total, item) => total + calculateItemIncome(item), 0);
};

// Add an atom to handle manual clicking
export const clickMoneyAtom = atom(null, (get, set) => {
  const gameState = get(gameStateAtom);
  const clickAmount = 1; // Base amount earned per click
  const purchasedUpgrades = get(purchasedUpgradesAtom);
  const currentTime = Date.now();

  // Check for click-related upgrades that might increase the click amount
  let finalClickAmount = clickAmount;
  if (purchasedUpgrades.includes("better_clicks")) {
    finalClickAmount *= 2;
  }

  // Calculate click rate
  const timeSinceLastClick = (currentTime - gameState.lastClickTime) / 1000; // in seconds
  // Use a weighted average to smooth out the click rate
  // This gives more weight to recent clicks (70% new, 30% old)
  const newClickRate =
    timeSinceLastClick > 0
      ? 0.7 * (1 / timeSinceLastClick) + 0.3 * (gameState.clickRate || 0)
      : gameState.clickRate || 0;

  set(
    gameStateAtom,
    produce(gameState, (draft) => {
      draft.money += finalClickAmount;
      draft.clickCount += 1;
      draft.lastClickTime = currentTime;
      draft.clickRate = isNaN(newClickRate) ? 0 : newClickRate;
    })
  );

  return finalClickAmount;
});

export const buyItemAtom = atom(null, (get, set, itemId: string) => {
  const gameState = get(gameStateAtom);

  const itemIndex = gameState.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return;

  const item = gameState.items[itemIndex];
  const price = calculateItemPrice(item);

  if (gameState.money < price) return;

  set(
    gameStateAtom,
    produce(gameState, (draft) => {
      draft.money -= price;
      draft.items[itemIndex].count += 1;
      draft.incomePerSecond = calculateTotalIncome(draft.items);
    })
  );

  return {
    action: "buy",
    itemName: item.name,
    price: price,
    count: item.count + 1,
  };
});

export const upgradeItemAtom = atom(null, (get, set, itemId: string) => {
  const gameState = get(gameStateAtom);

  const itemIndex = gameState.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return;

  const item = gameState.items[itemIndex];
  if (item.count === 0) return;

  const price = calculateUpgradePrice(item);

  if (gameState.money < price) return;

  set(
    gameStateAtom,
    produce(gameState, (draft) => {
      draft.money -= price;
      draft.items[itemIndex].level += 1;
      draft.incomePerSecond = calculateTotalIncome(draft.items);
    })
  );

  return {
    action: "upgrade",
    itemName: item.name,
    price,
    level: item.level + 1,
  };
});

export const purchaseUpgradeAtom = atom(null, (get, set, upgradeId: string) => {
  const gameState = get(gameStateAtom);
  const purchasedUpgrades = get(purchasedUpgradesAtom);

  // Find the upgrade
  const upgrade = UPGRADES.find((u) => u.id === upgradeId);

  // If the upgrade doesn't exist or has already been purchased, return
  if (!upgrade || purchasedUpgrades.includes(upgradeId)) return;

  // Check if the player has enough money
  if (gameState.money < upgrade.cost) return;

  // Apply the upgrade effect
  const newState = upgrade.effect(gameState);

  // Deduct the cost and save the new state
  set(
    gameStateAtom,
    produce(newState, (draft) => {
      draft.money -= upgrade.cost;
    })
  );

  // Mark the upgrade as purchased
  set(purchasedUpgradesAtom, [...purchasedUpgrades, upgradeId]);

  return {
    action: "purchase",
    upgradeName: upgrade.name,
    price: upgrade.cost,
  };
});

let lastSaveToastTime = 0;

export const updateGameStateAtom = atom(null, (get, set) => {
  const gameState = get(gameStateAtom);
  const currentTime = Date.now();
  const timeDifference = (currentTime - gameState.lastUpdate) / 1000; // in seconds

  if (timeDifference < 0.1) return false;

  const income = gameState.incomePerSecond * timeDifference;

  set(
    gameStateAtom,
    produce(gameState, (draft) => {
      draft.money += income;
      draft.lastUpdate = currentTime;
    })
  );

  if (currentTime - lastSaveToastTime > 60000) {
    lastSaveToastTime = currentTime;
    return true;
  }

  return false;
});

export const resetGameAtom = atom(null, (get, set) => {
  // Get current achievements
  const unlockedAchievements = get(achievementsAtom);

  // Create a fresh game state with current timestamp
  const freshGameState: GameState = {
    ...initialGameState,
    lastUpdate: Date.now(),
  };

  // Reset the game state using the global state atom
  // This preserves achievements but resets everything else
  set(globalStateAtom, {
    gameData: freshGameState,
    purchasedUpgrades: [],
    unlockedAchievements: unlockedAchievements.includes("reset_pioneer")
      ? unlockedAchievements
      : [...unlockedAchievements, "reset_pioneer"],
  });

  return {
    action: "reset",
    success: true,
  };
});

// Create a derived atom for total income (passive + active clicking)
export const totalIncomeAtom = atom((get) => {
  const gameState = get(gameStateAtom);
  // Combine passive income with click income
  const passiveIncome = gameState.incomePerSecond || 0;
  const activeIncome = gameState.clickRate || 0;

  // Return total income (ensure we never return NaN)
  const total = passiveIncome + activeIncome;
  return isNaN(total) ? 0 : total;
});
