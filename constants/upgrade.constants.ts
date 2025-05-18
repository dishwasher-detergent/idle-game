import { Upgrade } from "@/interfaces/game.interface";

export const UPGRADES: Upgrade[] = [
  {
    id: "better_clicks",
    name: "Better Clicks",
    description: "Double the money earned per click",
    cost: 100,
    effect: (state) => state, // Effect handled in clickMoneyAtom
    isAvailable: (state) => state.clickCount >= 20,
  },
  {
    id: "faster_production",
    name: "Faster Production",
    description: "Increases all production by 25%",
    cost: 1000,
    effect: (state) => ({
      ...state,
      items: state.items.map((item) => ({
        ...item,
        baseIncome: item.baseIncome * 1.25,
      })),
      incomePerSecond: state.incomePerSecond * 1.25,
    }),
    isAvailable: (state) => state.incomePerSecond >= 10,
  },
  {
    id: "cheaper_items",
    name: "Bulk Discounts",
    description: "Decreases the cost scaling of items by 5%",
    cost: 5000,
    effect: (state) => state, // Actual effect handled in the purchasing logic
    isAvailable: (state) => state.items.some((item) => item.count >= 10),
  },
  {
    id: "auto_click",
    name: "Auto Clicker",
    description: "Automatically gives you 1 click per second",
    cost: 1500,
    effect: (state) => state, // Actual effect handled in the game loop
    isAvailable: (state) => state.money >= 1000,
  },
];
