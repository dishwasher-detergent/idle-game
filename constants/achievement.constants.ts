import { Achievement, GameItem, GameState } from "@/interfaces/game.interface";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_purchase",
    name: "First Steps",
    description: "Buy your first business",
    icon: "🏪",
    isUnlocked: (state) => state.items.some((item: GameItem) => item.count > 0),
  },
  {
    id: "money_maker",
    name: "Money Maker",
    description: "Reach 100 money per second",
    icon: "💰",
    isUnlocked: (state: GameState) => state.incomePerSecond >= 100,
  },
  {
    id: "business_tycoon",
    name: "Business Tycoon",
    description: "Own at least 10 of any business",
    icon: "🏢",
    isUnlocked: (state) => state.items.some((item) => item.count >= 10),
  },
  {
    id: "upgrade_master",
    name: "Upgrade Master",
    description: "Upgrade any business to level 5",
    icon: "⬆️",
    isUnlocked: (state) => state.items.some((item) => item.level >= 5),
  },
  {
    id: "millionaire",
    name: "Millionaire",
    description: "Have 1,000,000 money at once",
    icon: "💎",
    isUnlocked: (state) => state.money >= 1000000,
  },
  {
    id: "diversified",
    name: "Diversified Portfolio",
    description: "Own at least one of each business type",
    icon: "📊",
    isUnlocked: (state) => state.items.every((item) => item.count > 0),
  },
  {
    id: "empire_builder",
    name: "Empire Builder",
    description: "Own a total of 50 businesses",
    icon: "🏭",
    isUnlocked: (state) => {
      const totalBusinesses = state.items.reduce(
        (sum, item) => sum + item.count,
        0
      );
      return totalBusinesses >= 50;
    },
  },
  {
    id: "reset_pioneer",
    name: "Fresh Start",
    description: "Reset your progress for the first time",
    icon: "🔄",
    isUnlocked: (state) => false, // This will be handled separately in the reset function
  },
  {
    id: "first_click",
    name: "First Click",
    description: "Earn your first money by clicking",
    icon: "👆",
    isUnlocked: (state) => state.money > 10, // Initial money is 10, so any increase means they clicked
  },
  {
    id: "click_master",
    name: "Click Master",
    description: "Click 100 times",
    icon: "🖱️",
    isUnlocked: (state) => state.clickCount >= 100,
  },
  {
    id: "click_enthusiast",
    name: "Click Enthusiast",
    description: "Click 500 times",
    icon: "🔥",
    isUnlocked: (state) => state.clickCount >= 500,
  },
];
