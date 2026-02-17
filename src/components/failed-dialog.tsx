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
        <DialogTitle className="text-destructive flex flex-row items-center gap-2">
          Level Failed <Frown />
        </DialogTitle>
        <DialogDescription className="text-sm text-center">
          You have failed to complete the level. Don't worry, you can try again!
        </DialogDescription>
        <DialogFooter className="flex-row">
          <Link to="/">
            <Button variant="outline" onClick={() => playBGMenu()}>
              <Home />
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => {
              props.onTry();
              playBGMenu();
            }}
          >
            Try Again
            <RotateCcw />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
