"use client";

import AchievementsPanel from "@/components/game/achievements-panel";
import { BusinessVisualizer } from "@/components/game/business-visualizer";
import { BusinessesSection } from "@/components/game/businesses-section";
import { ClickArea } from "@/components/game/click-area";
import { GameHeader } from "@/components/game/game-header";
import StatisticsPanel from "@/components/game/statistics-panel";
import UpgradesPanel from "@/components/game/upgrades-panel";
import { useGameUpdater } from "@/hooks/useGameUpdater";

export default function GamePage() {
  // Use the custom hook for game updates
  useGameUpdater();

  return (
    <div className="container mx-auto p-4">
      <GameHeader />
      <ClickArea />
      <BusinessVisualizer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessesSection />
        <div className="space-y-6">
          <StatisticsPanel />
          <UpgradesPanel />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
}
