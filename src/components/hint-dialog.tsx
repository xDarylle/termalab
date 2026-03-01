import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

type LevelData = {
  term: string;
  description: string;
  sample_text: string;
};

function replaceWithBlanks(word: string, sentence: string): string {
  if (!word) return sentence;

  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const lower = word.toLowerCase();
  const escapedWord = escapeRegex(lower);

  let pattern: string;

  if (lower.endsWith("y") && !/[aeiou]y$/.test(lower)) {
    const base = escapeRegex(lower.slice(0, -1));
    pattern = `${base}(y|ies)`;
  } else if (/(s|x|z|ch|sh)$/.test(lower)) {
    pattern = `${escapedWord}(es)?`;
  } else {
    pattern = `${escapedWord}s?`;
  }

  const regex = new RegExp(`\\b${pattern}\\b`, "gi");

  return sentence.replace(regex, (match) =>
    "_".repeat(match.length),
  );
}

export const HintDialog = (props: { data: LevelData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="text-xs min-w-20 sm:text-sm h-8 sm:h-9">
          <span className="hidden sm:inline">Description</span>
          <span className="sm:hidden">Hint</span>
          <Lightbulb className="size-3.5 sm:size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="font-gummy text-primary flex flex-row items-center gap-1 text-base sm:text-lg">
          Description
          <Lightbulb className="size-4 sm:size-5" />
        </DialogTitle>
        <DialogDescription className="font-gummy text-xs sm:text-sm text-secondary text-center">
          {props.data.description}
        </DialogDescription>
        <div className="text-center text-pretty text-xs sm:text-sm font-gummy bg-card w-full p-2 sm:p-3 rounded">
          {replaceWithBlanks(props.data.term, props.data.sample_text)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
