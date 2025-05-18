import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gameStateAtom } from "@/lib/atoms";
import { formatMoney } from "@/lib/utils";
import { useAtom } from "jotai";
import { useMemo } from "react";

export default function StatisticsPanel() {
  const [gameState] = useAtom(gameStateAtom);

  const totalBusinesses = useMemo(() => {
    return gameState.items.reduce((total, item) => total + item.count, 0);
  }, [gameState.items]);

  const totalUpgradeLevels = useMemo(() => {
    return gameState.items.reduce(
      (total, item) => total + (item.level - 1) * item.count,
      0
    );
  }, [gameState.items]);

  const mostProfitableBusiness = useMemo(() => {
    let mostProfitable = gameState.items[0];
    let highestIncome = 0;

    gameState.items.forEach((item) => {
      const income =
        item.baseIncome *
        item.count *
        Math.pow(item.upgradeMultiplier, item.level - 1);
      if (income > highestIncome && item.count > 0) {
        mostProfitable = item;
        highestIncome = income;
      }
    });

    return mostProfitable;
  }, [gameState.items]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>
          Track your progress and see how far you've come!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Total Businesses</p>
            <p className="text-lg font-bold">{totalBusinesses}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Upgrades Purchased</p>
            <p className="text-lg font-bold">{totalUpgradeLevels}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Income Per Second</p>
          <p className="text-lg font-bold">
            ${formatMoney(gameState.incomePerSecond)}
          </p>
        </div>
        {mostProfitableBusiness && mostProfitableBusiness.count > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">
              Most Profitable Business
            </p>
            <p className="text-lg font-bold">{mostProfitableBusiness.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
