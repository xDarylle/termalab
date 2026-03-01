import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { Link } from "react-router";

export const LevelCompleteDialog = (props: { onConfirm: () => void }) => {
  return (
    <div className="min-w-full max-w-sm sm:max-w-md bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-3 sm:gap-4 font-gummy mx-2">
      <p className="ribbon text-sm text-white px-3 py-1">Level Complete!</p>
      <p>You have completed this level!</p>
      <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary size-4" /> 50 Words Completed
        </div>
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary size-4" /> All Challenges
          Cleared
        </div>
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary size-4" /> Level Mastered
        </div>

        <DialogFooter className="mt-3 sm:mt-4 flex-col sm:flex-row gap-2">
          <Button onClick={props.onConfirm} size="sm" className="w-full sm:w-auto">Replay Level</Button>
          <Link to="/" replace className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full">
              Back to Home
            </Button>
          </Link>
        </DialogFooter>
      </div>
    </div>
  );
};
