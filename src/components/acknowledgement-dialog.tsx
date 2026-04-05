import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { PropsWithChildren } from "react";
import { ScrollArea } from "./ui/scroll-area";

export function AcknowledgmentDialog(props: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="w-md sm:h-auto overflow-hidden rounded-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold text-primary">
              Acknowledgment
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-max">
            <div className="p-4 overflow-y-auto text-sm leading-relaxed space-y-4">
              <p className="font-medium">
                Special thanks to <strong>Darylle C. Jumalon</strong> from
                Dingle, Iloilo, for bringing this game I imagined to life.
              </p>

              <p>
                To my parents, <strong>Pablo M. Cutaran Jr.</strong> and{" "}
                <strong>Domelyn I. Cutaran</strong>, and my younger sister,{" "}
                <strong>Psykey Mae I. Cutaran</strong>, for their financial and
                emotional support, and for a love I never had to question.
              </p>

              <p>
                To <strong>Dr. Ricky M. Magno</strong>, for his guidance and
                patience as my adviser.
              </p>

              <p>
                And to all the people who believed in me, even when I struggled
                to believe in myself—thank you.
              </p>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t text-center text-xs text-muted-foreground">
            With gratitude ❤️
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
