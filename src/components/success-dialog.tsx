import { Link } from "react-router";
import { CircleDollarSign, Home, Play } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { useAudio } from "@/hooks/useAudio";
import { DEFAULT_PER_LEVEL_REWARD } from "./coin-provider";

export const SuccessDialog = (props: { open: boolean; onNext: () => void }) => {
  const { playBGMenu } = useAudio();

  return (
    <Dialog open={props.open}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="text-lg sm:text-xl">Level Complete!</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center">
          Congratulations on completing the level!
        </DialogDescription>
        <div className="flex flex-row items-center rounded-full gap-1 justify-between px-2 h-8 sm:h-9 text-white">
          <CircleDollarSign className="size-5 sm:size-6 bg-secondary rounded-full p-1" />
          <span className="text-xs sm:text-sm font-bold mx-1 text-secondary">+{DEFAULT_PER_LEVEL_REWARD}</span>
        </div>

        <p className="text-sm sm:text-base">Continue to the next level?</p>

        <DialogFooter className="flex-row gap-2 w-full sm:w-auto">
          <Link to="/" className="flex-1 sm:flex-none">
            <Button variant="outline" onClick={() => playBGMenu()} className="w-full sm:w-auto" size="sm">
              <Home className="size-4 sm:size-5" />
            </Button>
          </Link>
          <Button
            onClick={() => {
              playBGMenu();
              props.onNext();
            }}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            Next Level
            <Play className="fill-background size-4 sm:size-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
