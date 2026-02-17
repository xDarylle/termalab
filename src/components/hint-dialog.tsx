import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { DEFAULT_HINT_COST } from "./coin-provider";
import { Lightbulb } from "lucide-react";

type LevelData = {
  term: string;
  description: string;
  sample_text: string;
};

export const HintDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: LevelData;
}) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        {showHint ? (
          <>
            <DialogTitle className="font-gummy text-primary flex flex-row items-center gap-1">
              <Lightbulb className="size-4"/>
              Hint
            </DialogTitle>
            <DialogDescription className="font-gummy text-sm text-secondary">
              {props.data.description}
            </DialogDescription>
          </>
        ) : (
          <>
            <DialogTitle className="font-gummy text-primary">
              Buy Hint?
            </DialogTitle>
            <DialogDescription className="font-gummy text-sm text-secondary">
              Get a hint for {DEFAULT_HINT_COST} coins.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setShowHint(true)}>Buy</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
