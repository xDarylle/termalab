import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";

export const StartGameDialog = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="font-gummy text-primary text-lg sm:text-xl">
          Welcome to Termalab!
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center">
          In this game, you will be given a series of puzzles to solve. Each
          puzzle consists of a word that you need to guess. You have 6 attempts
          to guess the word correctly. After each guess, you will receive
          feedback on which letters are correct and in the correct position, which
          letters are correct but in the wrong position, and which letters are
          not in the word at all.
        </DialogDescription>
        <DialogFooter className="w-full sm:w-auto">
          <Button onClick={() => setOpen(false)} className="w-full sm:w-auto">Start Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
