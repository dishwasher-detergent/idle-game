"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateUpgradePrice, gameStateAtom } from "@/lib/atoms";
import { formatMoney } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

// Define business icons
const businessIcons: Record<string, string> = {
  lemonade_stand: "🍋",
  newspaper_delivery: "📰",
  car_wash: "🚗",
  pizza_shop: "🍕",
  tech_startup: "💻",
};

export function BusinessVisualizer() {
  const gameState = useAtomValue(gameStateAtom);
  const [pulsingBusinesses, setPulsingBusinesses] = useState<
    Record<string, boolean>
  >({});

  // Only show businesses the player owns
  const ownedBusinesses = gameState.items.filter((item) => item.count > 0);

  // Set up pulse animations for businesses when they generate income
  useEffect(() => {
    // Create a longer interval for visual pulses so they're not too frequent
    const interval = setInterval(() => {
      const newPulsingState: Record<string, boolean> = {};

      // Only pulse businesses with income
      ownedBusinesses.forEach((business) => {
        if (business.count > 0) {
          newPulsingState[business.id] = true;

          // Schedule the removal of the pulse after a short delay
          setTimeout(() => {
            setPulsingBusinesses((prev) => ({
              ...prev,
              [business.id]: false,
            }));
          }, 500);
        }
      });

      setPulsingBusinesses(newPulsingState);
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, [ownedBusinesses]);

  if (ownedBusinesses.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 mb-6 text-center">
        <p className="text-muted-foreground">
          Buy your first business to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Empire</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ownedBusinesses.map((business) => (
          <TooltipProvider key={business.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex flex-col items-center p-3 bg-background rounded-lg shadow-sm transition-all hover:shadow-md hover:scale-105 cursor-default group relative overflow-hidden ${
                    pulsingBusinesses[business.id]
                      ? "shadow-green-200 dark:shadow-green-900"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute -top-10 -right-10 w-24 h-24 bg-green-500/5 rounded-full transform transition-transform duration-500 ${
                      pulsingBusinesses[business.id]
                        ? "scale-150 bg-green-500/10"
                        : "group-hover:scale-150"
                    }`}
                  ></div>
                  <div
                    className={`text-4xl mb-2 ${
                      pulsingBusinesses[business.id]
                        ? "animate-bounce"
                        : "group-hover:animate-pulse"
                    }`}
                  >
                    {businessIcons[business.id] || "🏢"}
                  </div>
                  <p className="font-medium text-center truncate w-full">
                    {business.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="transition-all">
                      {business.count}x
                    </Badge>
                    {business.level > 1 && (
                      <Badge variant="secondary" className="transition-all">
                        Lvl {business.level}
                      </Badge>
                    )}
                  </div>{" "}
                  <p className="text-xs text-green-500 mt-2 font-medium">
                    $
                    {formatMoney(
                      business.baseIncome *
                        business.count *
                        Math.pow(business.upgradeMultiplier, business.level - 1)
                    )}
                    /sec
                  </p>
                  {/* Upgrade progress */}
                  {business.count > 0 && (
                    <div className="mt-2 w-full">
                      <Progress
                        value={Math.min(
                          (gameState.money / calculateUpgradePrice(business)) *
                            100,
                          100
                        )}
                        className="h-1"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-center">
                        {gameState.money >= calculateUpgradePrice(business)
                          ? "Ready to upgrade!"
                          : `Upgrade: ${Math.floor(
                              (gameState.money /
                                calculateUpgradePrice(business)) *
                                100
                            )}%`}
                      </p>
                    </div>
                  )}
                </div>
              </TooltipTrigger>{" "}
              <TooltipContent>
                <div className="p-2">
                  <p className="font-bold">{business.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {business.description}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      Owned:{" "}
                      <span className="font-semibold">{business.count}</span>
                    </p>
                    <p className="text-sm">
                      Level:{" "}
                      <span className="font-semibold">{business.level}</span>
                    </p>
                    <p className="text-sm text-green-500">
                      Income: $
                      {formatMoney(
                        business.baseIncome *
                          business.count *
                          Math.pow(
                            business.upgradeMultiplier,
                            business.level - 1
                          )
                      )}
                      /sec
                    </p>

                    {business.count > 0 && (
                      <>
                        <div className="mt-2">
                          <p className="text-sm">
                            Upgrade cost:{" "}
                            <span className="font-semibold">
                              ${formatMoney(calculateUpgradePrice(business))}
                            </span>
                          </p>
                          <p className="text-sm">
                            Next level income:{" "}
                            <span className="text-green-500 font-semibold">
                              $
                              {formatMoney(
                                business.baseIncome *
                                  business.count *
                                  Math.pow(
                                    business.upgradeMultiplier,
                                    business.level
                                  )
                              )}
                              /sec
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
