"use client";

import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameItem } from "@/interfaces/game.interface";
import {
  buyItemAtom,
  calculateItemIncome,
  calculateItemPrice,
  calculateUpgradePrice,
  upgradeItemAtom,
} from "@/lib/atoms";
import { formatMoney } from "@/lib/utils";

interface ItemCardProps {
  item: GameItem;
  playerMoney: number;
}

export function ItemCard({ item, playerMoney }: ItemCardProps) {
  const buyItem = useSetAtom(buyItemAtom);
  const upgradeItem = useSetAtom(upgradeItemAtom);

  const price = useMemo(() => calculateItemPrice(item), [item]);
  const upgradePrice = useMemo(() => calculateUpgradePrice(item), [item]);
  const income = useMemo(() => calculateItemIncome(item), [item]);

  const canBuy = playerMoney >= price;
  const canUpgrade = playerMoney >= upgradePrice && item.count > 0;
  const handleBuy = () => {
    const result = buyItem(item.id);
    if (result) {
      toast.success(`Purchased ${result.itemName}`, {
        description: `You now own ${result.count} ${result.itemName}${
          result.count > 1 ? "s" : ""
        }`,
      });
    }
  };

  const handleUpgrade = () => {
    const result = upgradeItem(item.id);
    if (result) {
      toast.success(`Upgraded ${result.itemName}`, {
        description: `${result.itemName} is now level ${result.level}`,
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <div className="mt-2">
            <p className="text-sm">
              Owned: <span className="font-semibold">{item.count}</span>
            </p>
            <p className="text-sm">
              Level: <span className="font-semibold">{item.level}</span>
            </p>
            <p className="text-sm text-green-500">
              Income: ${formatMoney(income)}/sec
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {" "}
          <Button
            onClick={handleBuy}
            disabled={!canBuy}
            variant={canBuy ? "default" : "outline"}
            className="w-full"
          >
            Buy for ${formatMoney(price)}
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={!canUpgrade}
            variant={canUpgrade ? "outline" : "ghost"}
            className="w-full"
          >
            Upgrade for ${formatMoney(upgradePrice)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
