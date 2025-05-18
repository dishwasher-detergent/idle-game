"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { resetGameAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ResetGameButton() {
  const [open, setOpen] = useState(false);
  const resetGame = useSetAtom(resetGameAtom);
  
  const handleReset = () => {
    const result = resetGame();
    if (result && result.success) {
      toast.success("Game Reset", {
        description: "Your progress has been reset. Starting fresh!",
      });
    }
    setOpen(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" /> Reset Progress
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>          <AlertDialogDescription>
            This action cannot be undone. All of your game progress will be
            permanently deleted and you'll start over with the initial game
            state.
          </AlertDialogDescription>
          <div className="mt-4 border rounded-md p-4 space-y-2 text-sm">
            <p className="font-medium">What will be reset:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Current money balance</li>
              <li>All businesses and their levels</li>
              <li>Income per second</li>
              <li>Purchased upgrades</li>
              <li>Achievements progress</li>
            </ul>
            <p className="font-medium mt-3">What will be preserved:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lifetime statistics</li>
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, reset everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
