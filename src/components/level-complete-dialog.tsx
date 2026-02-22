import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { Link } from "react-router";

export const LevelCompleteDialog = (props: { onConfirm: () => void }) => {
  return (
    <div className="min-w-full max-w-md bg-card border border-border rounded-lg p-5 flex flex-col items-center gap-4 font-gummy">
      <p className="ribbon text-sm text-white">Level Complete!</p>
      <p>You have completed this level!</p>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary" /> 50 Words Completed
        </div>
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary" /> All Challenges
          Cleared
        </div>
        <div className="flex flex-row items-center gap-2">
          <Star className="text-secondary fill-secondary" /> Level Mastered
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={props.onConfirm}>Replay Level</Button>
          <Link to="/" replace>
            <Button variant="secondary" className="w-full">
              Back to Home
            </Button>
          </Link>
        </DialogFooter>
      </div>
    </div>
  );
};
