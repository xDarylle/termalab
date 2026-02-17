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


export const SuccessDialog = (props: { open: boolean }) => {
  const { playBGMenu } = useAudio();

  return (
    <Dialog open={props.open}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle>Level Complete!</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center">
          Congratulations on completing the level!
        </DialogDescription>
        <div className="flex flex-row items-center rounded-full gap-1 justify-between px-2 h-9 text-white">
          <CircleDollarSign className="size-6 bg-secondary rounded-full p-1" />
          <span className="text-sm font-bold mx-1 text-secondary">+100</span>
        </div>

        <p>Continue to the next level?</p>

        <DialogFooter className="flex-row">
          <Link to="/">
            <Button variant="outline" onClick={() => playBGMenu()}>
              <Home />
            </Button>
          </Link>
          <Button onClick={() => playBGMenu()}>
            Next Level
            <Play className="fill-background" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
