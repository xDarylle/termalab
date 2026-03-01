import { House } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Link } from "react-router";

export const HomeButton = () => {
  const isNotHome = window.location.pathname !== "/";
  return (
    isNotHome && (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
            <House className="size-4 sm:size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-base sm:text-lg">Leave Game?</DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground text-center text-pretty">
            Are you sure you want to leave the current game?
          </p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">Cancel</Button>
            </DialogClose>
            <Link to="/" replace className="w-full sm:w-auto">
              <Button variant="destructive" size="sm" className="w-full">
                Leave Game
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};
