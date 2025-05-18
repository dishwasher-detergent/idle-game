import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ACHIEVEMENTS } from "@/constants/achievement.constants";
import { Achievement } from "@/interfaces/game.interface";
import { achievementsAtom, gameStateAtom } from "@/lib/atoms";

export default function AchievementsPanel() {
  const [gameState] = useAtom(gameStateAtom);
  const [unlockedAchievementIds, setUnlockedAchievementIds] =
    useAtom(achievementsAtom);

  const [achievements, setAchievements] = useState<Achievement[]>(
    ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedAchievementIds.includes(achievement.id),
    }))
  );

  useEffect(() => {
    let newlyUnlocked = false;
    let newUnlockedIds: string[] = [...unlockedAchievementIds];

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (!achievement.unlocked && achievement.isUnlocked(gameState)) {
          newlyUnlocked = true;
          newUnlockedIds.push(achievement.id);
          return { ...achievement, unlocked: true };
        }
        return achievement;
      })
    );

    if (newlyUnlocked) {
      setUnlockedAchievementIds(newUnlockedIds);

      toast("Achievement Unlocked!", {
        description: "Check the achievements tab to see your new rewards!",
      });
    }
  }, [gameState, unlockedAchievementIds, setUnlockedAchievementIds]);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          Unlock achievements to earn rewards and track your progress!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {unlockedAchievements.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">
              Unlocked ({unlockedAchievements.length}/{achievements.length})
            </h3>
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-3 border flex rounded-xl items-start gap-2 justify-between"
              >
                <div className="flex items-start gap-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-bold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <Badge variant="default">Unlocked</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No achievements unlocked yet. Keep playing!
          </p>
        )}
        {lockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Locked</h3>
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-3 border flex rounded-xl items-start gap-2 justify-between"
              >
                <div className="flex items-start gap-2">
                  <div className="text-2xl text-muted-foreground">
                    {achievement.icon}
                  </div>
                  <div className="text-muted-foreground">
                    <h4 className="font-bold">{achievement.name}</h4>
                    <p className="text-sm">{achievement.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">Locked</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
