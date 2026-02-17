import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { CircleDollarSign, Lock, Star } from "lucide-react";
import type { Status } from "@/lib/status";
import { Container } from "@/components/container";
import Keyboard from "@/components/Keyboard";
import { Button } from "@/components/ui/button";
import { getStatus } from "@/lib/status";
import { cn } from "@/lib/utils";
import { SuccessDialog } from "@/components/success-dialog";
import { FailedDialog } from "@/components/failed-dialog";
import { useAudio } from "@/hooks/useAudio";
import { LoadLevel } from "@/lib/level-loader";
import { DEFAULT_HINT_COST, useCoins } from "@/components/coin-provider";
import { HintDialog } from "@/components/hint-dialog";

export function Game() {
  const { level } = useParams();
  const { addCoins } = useCoins();

  const [data, setData] = useState<
    {
      term: string;
      description: string;
      sample_text: string;
    }[]
  >([]);

  useEffect(() => {
    if (!level) return;
    LoadLevel(level)
      .then((module) => setData(module.default || module))
      .catch((err) => console.error(err));
  }, [level]);

  const PLAYER_LEVEL = parseInt(
    localStorage.getItem(`playerLevel-${level}`) || "0",
  );
  const word =
    data[PLAYER_LEVEL]?.term.toUpperCase().replaceAll(" ", "") || "";

  const [rowIndex, setRowIndex] = useState(0);
  const [guess, setGuess] = useState<Array<string>>([]);
  const [status, setStatus] = useState<Array<Array<Status>>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const { playButtonClick, playSuccess, playFailure } = useAudio();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Standard way to trigger the confirmation dialog

      if (isComplete) {
        localStorage.setItem(
          `playerLevel-${level}`,
          (PLAYER_LEVEL + 1).toString(),
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isComplete, level, PLAYER_LEVEL]);

  const handleSubmit = () => {
    if (guess[rowIndex]?.length !== word.length) return;

    playButtonClick();

    const newStatus = getStatus(guess[rowIndex], word);
    setStatus((prev) => [...prev, newStatus]);

    if (word === guess[rowIndex]) {
      setIsComplete(true);
      playSuccess();
      addCoins();
    }
    if (rowIndex === 5 && word !== guess[rowIndex]) {
      setIsFailed(true);
      playFailure();
    }

    setRowIndex((prev) => prev + 1);
  };

  const reset = () => {
    setGuess([]);
    setStatus([]);
    setRowIndex(0);
    setIsComplete(false);
    setIsFailed(false);
  };

  return (
    <div className="flex flex-col items-center h-max my-auto pt-4 pb-2">
      <SuccessDialog
        open={isComplete}
        onNext={() => {
          localStorage.setItem(
            `playerLevel-${level}`,
            (PLAYER_LEVEL + 1).toString(),
          );
          reset();
        }}
      />
      <FailedDialog open={isFailed} onTry={reset} />
      <HintDialog
        open={hintOpen}
        setOpen={setHintOpen}
        data={data[PLAYER_LEVEL]}
      />
      <Container className="max-w-96 mx-auto my-auto font-gummy flex flex-col gap-y-2 rounded-md">
        <div className="flex flex-row items-center justify-between text-sm">
          <p className="font-medium text-primary">
            {level?.toUpperCase()} LEVEL
          </p>
          <div className="flex flex-row items-center gap-2">
            <Star fill="#fcc800" className="text-yellow-400 size-4" />
            <span>{PLAYER_LEVEL + 1}/50</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 font-sans font-medium uppercase">
          {[...Array(6)].map((_, index) => (
            <Row
              key={index}
              columns={word.length}
              guess={guess[index]}
              status={status[index]}
            />
          ))}
        </div>
      </Container>
      <Button
        variant="secondary"
        className="my-4"
        size="sm"
        onClick={() => setHintOpen(true)}
      >
        <Lock />
        Unlock Hint
        <div className="flex flex-row items-center ml-1 gap-1 bg-black/20 text-white pl-0.5 pr-1 rounded-full">
          <CircleDollarSign className="size-4" />
          {DEFAULT_HINT_COST}
        </div>
      </Button>
      <Keyboard
        onKeyPress={(key) => {
          setGuess((prev) => {
            if (prev.length < rowIndex + 1) return [...prev, key];
            if (prev[rowIndex]?.length < word.length) {
              return prev.map((g, index) => (index === rowIndex ? g + key : g));
            }
            return prev;
          });
        }}
        onDelete={() => {
          setGuess((prev) =>
            prev.map((g, index) => (index === rowIndex ? g.slice(0, -1) : g)),
          );
        }}
      />
      <Button
        className="mt-4"
        onClick={handleSubmit}
        disabled={guess[rowIndex]?.length !== word.length}
      >
        Submit Word
      </Button>
    </div>
  );
}

const Row = ({
  columns,
  guess,
  status,
}: {
  columns: number;
  guess?: string;
  status?: Array<Status>;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-0.5">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            "w-10 h-10 rounded flex items-center justify-center bg-muted text-[clamp(0.5rem,3vw,1rem)]",
            status && status[colIndex] === "GREEN" && "bg-green-500 text-white",
            status &&
              status[colIndex] === "YELLOW" &&
              "bg-yellow-500 text-white",
            status && status[colIndex] === "GRAY" && "bg-gray-500 text-white",
          )}
        >
          {guess && guess[colIndex]}
        </div>
      ))}
    </div>
  );
};
