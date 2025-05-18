export interface GameItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseIncome: number;
  count: number;
  level: number;
  upgradeMultiplier: number;
  upgradeCostMultiplier: number;
}

export interface GameState {
  money: number;
  lastUpdate: number;
  incomePerSecond: number;
  items: GameItem[];
  clickCount: number;
  clickRate: number; // Tracks clicks per second
  lastClickTime: number; // Timestamp of last click to calculate rate
}

export interface GlobalState {
  gameData: GameState;
  purchasedUpgrades: string[];
  unlockedAchievements: string[];
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (state: GameState) => GameState;
  isAvailable: (state: GameState) => boolean;
  isPurchased?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: (state: GameState) => boolean;
  unlocked?: boolean;
}
