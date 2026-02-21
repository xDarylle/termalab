import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
    // city -> city | cities
    const base = escapeRegex(lower.slice(0, -1));
    pattern = `${base}(y|ies)`;
  } else if (/(s|x|z|ch|sh)$/.test(lower)) {
    // box -> box | boxes
    pattern = `${escapedWord}(es)?`;
  } else {
    // atom -> atom | atoms
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
        <Button variant="default" size="sm">
          Description
          <Lightbulb />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="font-gummy text-primary flex flex-row items-center gap-1">
          Description
          <Lightbulb className="size-4" />
        </DialogTitle>
        <DialogDescription className="font-gummy text-sm text-secondary">
          {props.data.description}
        </DialogDescription>
        <DialogFooter className="text-center text-pretty text-sm font-gummy bg-card w-full p-2 rounded">
          {replaceWithBlanks(props.data.term, props.data.sample_text)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
