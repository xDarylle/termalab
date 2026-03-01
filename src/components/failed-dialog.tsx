import { Link } from "react-router";

import { Frown, Home, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { useAudio } from "@/hooks/useAudio";

export const FailedDialog = (props: { open: boolean; onTry: () => void }) => {
  const { playBGMenu } = useAudio();
  return (
    <Dialog open={props.open}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="text-destructive flex flex-row items-center gap-2 text-lg sm:text-xl">
          Level Failed <Frown className="size-5 sm:size-6" />
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-center">
          You have failed to complete the level. Don't worry, you can try again!
        </DialogDescription>
        <DialogFooter className="flex-row gap-2 w-full sm:w-auto">
          <Link to="/" className="flex-1 sm:flex-none">
            <Button variant="outline" onClick={() => playBGMenu()} className="w-full sm:w-auto" size="sm">
              <Home className="size-4 sm:size-5" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => {
              props.onTry();
              playBGMenu();
            }}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            Try Again
            <RotateCcw className="size-4 sm:size-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
