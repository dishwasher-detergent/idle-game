import { useAtom } from "jotai";
import { useMemo } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UPGRADES } from "@/constants/upgrade.constants";
import {
  gameStateAtom,
  purchaseUpgradeAtom,
  purchasedUpgradesAtom,
} from "@/lib/atoms";
import { formatMoney } from "@/lib/utils";

export default function UpgradesPanel() {
  const [gameState] = useAtom(gameStateAtom);
  const [purchasedUpgradesIds] = useAtom(purchasedUpgradesAtom);
  const [, purchaseUpgrade] = useAtom(purchaseUpgradeAtom);

  // Derive available and purchased upgrades from our constants and state
  const { availableUpgrades, purchasedUpgrades } = useMemo(() => {
    const purchased = UPGRADES.filter((u) =>
      purchasedUpgradesIds.includes(u.id)
    );
    const available = UPGRADES.filter(
      (u) => !purchasedUpgradesIds.includes(u.id) && u.isAvailable(gameState)
    );

    return { availableUpgrades: available, purchasedUpgrades: purchased };
  }, [gameState, purchasedUpgradesIds]);
  const handlePurchaseUpgrade = (upgradeId: string) => {
    const result = purchaseUpgrade(upgradeId);
    if (result) {
      toast.success(`Purchased ${result.upgradeName}`, {
        description: `You've unlocked a new upgrade for $${formatMoney(
          result.price
        )}`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrades</CardTitle>
        <CardDescription>
          Purchase upgrades to enhance your game experience and boost your
          progress!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchasedUpgrades.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Purchased</h3>
            {purchasedUpgrades.map((upgrade) => (
              <div
                key={upgrade.id}
                className="p-3 border flex rounded-xl items-start gap-2 justify-between"
              >
                <div>
                  <h4 className="font-bold">{upgrade.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {upgrade.description}
                  </p>
                </div>
                <Badge variant="default">Purchased</Badge>
              </div>
            ))}
          </div>
        )}
        {availableUpgrades.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Available</h3>
            {availableUpgrades.map((upgrade) => (
              <div
                key={upgrade.id}
                className="p-3 border flex rounded-xl items-start gap-2 justify-between"
              >
                <div>
                  <h4 className="font-bold">{upgrade.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {upgrade.description}
                  </p>
                </div>
                <Button
                  onClick={() => handlePurchaseUpgrade(upgrade.id)}
                  disabled={gameState.money < upgrade.cost}
                >
                  Buy for ${formatMoney(upgrade.cost)}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
