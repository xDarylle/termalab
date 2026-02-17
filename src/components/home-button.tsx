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
          <Button>
            <House className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Leave Game?</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Are you sure you want to leave the current game? Your progress will
            not be saved.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Link to="/" replace>
              <Button variant="destructive" className="w-full">
                Leave Game
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};
