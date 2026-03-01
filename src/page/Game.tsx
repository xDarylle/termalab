import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  KeyboardIcon,
  LoaderIcon,
  SearchAlert,
  Star,
} from "lucide-react";
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
import { HINTS, useCoins } from "@/components/coin-provider";
import { HintDialog } from "@/components/hint-dialog";
import { LevelCompleteDialog } from "@/components/level-complete-dialog";

const MAX_ROWS = 6;

export function Game() {
  const { level } = useParams();
  const { addCoins, canBuyHints, payHints } = useCoins();
  const { playButtonClick, playSuccess, playFailure, playHint } = useAudio();

  const [data, setData] = useState<
    { term: string; description: string; sample_text: string }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [hintIndex, setHintIndex] = useState<number[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [guess, setGuess] = useState<string[][]>([]);
  const [status, setStatus] = useState<Array<Array<Status | undefined>>>([]);

  const [keyboardHint, setKeyboardHint] = useState(false);

  const [isComplete, setIsComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const PLAYER_LEVEL = parseInt(
    localStorage.getItem(`playerLevel-${level}`) || "0",
  );

  const word = useMemo(() => {
    return data[PLAYER_LEVEL]?.term?.toUpperCase().replaceAll(" ", "") || "";
  }, [data, PLAYER_LEVEL]);

  const gameStateKey = `gameState-${level}-${PLAYER_LEVEL}`;

  /* ---------------- LOAD LEVEL + RESTORE STATE ---------------- */

  useEffect(() => {
    if (!level) return;

    LoadLevel(level)
      .then((module) => {
        const loaded = module.default || module;
        setData(loaded.slice(0, 10));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [level]);

  useEffect(() => {
    if (!word) return;

    const saved = localStorage.getItem(gameStateKey);

    if (saved) {
      const parsed = JSON.parse(saved);
      setGuess(parsed.guess);
      setStatus(parsed.status);
      setRowIndex(parsed.rowIndex);
      setHintIndex(parsed.hintIndex);
      setIsComplete(parsed.isComplete);
      setIsFailed(parsed.isFailed);
      setKeyboardHint(parsed.keyboardHint)
    } else {
      const freshBoard = Array.from({ length: MAX_ROWS }, () =>
        Array.from({ length: word.length }, () => ""),
      );
      setGuess(freshBoard);
      setStatus([]);
      setRowIndex(0);
      setHintIndex([]);
      setIsComplete(false);
      setIsFailed(false);
      setKeyboardHint(false)
    }
  }, [word]);

  /* ---------------- AUTO SAVE ---------------- */

  useEffect(() => {
    if (!word) return;

    const state = {
      guess,
      status,
      rowIndex,
      hintIndex,
      isComplete,
      isFailed,
      keyboardHint
    };

    localStorage.setItem(gameStateKey, JSON.stringify(state));
  }, [guess, status, rowIndex, hintIndex, isComplete, isFailed, keyboardHint]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    if (guess[rowIndex].includes("")) return;

    playButtonClick();

    const playerGuess = guess[rowIndex].join("");
    const newStatus = getStatus(playerGuess, word);

    setStatus((prev) => {
      const copy = [...prev];
      copy[rowIndex] = newStatus;
      return copy;
    });

    if (playerGuess === word) {
      if (hintIndex.length >= word.length) {
        setIsComplete(true);
        playSuccess();
        addCoins();
      } else {
        setTimeout(() => {
          setIsComplete(true);
          playSuccess();
          addCoins();
        }, 400);
      }

      return;
    }

    if (rowIndex === MAX_ROWS - 1) {
      setTimeout(() => {
        setIsFailed(true);
        playFailure();
      }, 400);

      return;
    }

    setTimeout(() => {
      const nextRow = rowIndex + 1;

      setRowIndex(nextRow);

      setGuess((prev) => {
        const copy = [...prev];
        const nextRowData = [...copy[nextRow]];

        hintIndex.forEach((i) => {
          nextRowData[i] = word[i];
        });

        copy[nextRow] = nextRowData;
        return copy;
      });

      setStatus((prev) => {
        const copy = [...prev];
        const hintStatus = Array.from({ length: word.length }, (_, i) =>
          hintIndex.includes(i) ? "GREEN" : undefined,
        );
        copy[nextRow] = hintStatus;
        return copy;
      });
    }, 300);
  };

  /* ---------------- RESET ---------------- */

  const reset = () => {
    localStorage.removeItem(gameStateKey);

    const freshBoard = Array.from({ length: MAX_ROWS }, () =>
      Array.from({ length: word.length }, () => ""),
    );

    setGuess(freshBoard);
    setStatus([]);
    setRowIndex(0);
    setHintIndex([]);
    setIsComplete(false);
    setIsFailed(false);
    setKeyboardHint(false);
  };

  /* ---------------- HINT ---------------- */

  const handleHintCharacter = () => {
    if (hintIndex.length >= word.length) return;

    const available = word
      .split("")
      .map((_, i) => i)
      .filter((i) => !hintIndex.includes(i));

    if (available.length === 0) return;

    playHint()
    payHints("CHARACTER");

    const randomIndex = available[Math.floor(Math.random() * available.length)];

    const updatedHints = [...hintIndex, randomIndex];
    setHintIndex(updatedHints);

    setGuess((prev) => {
      const copy = [...prev];
      const currentRow = [...copy[rowIndex]];
      currentRow[randomIndex] = word[randomIndex];
      copy[rowIndex] = currentRow;
      return copy;
    });

    setStatus((prev) => {
      const copy = [...prev];
      const hintStatus = Array.from({ length: word.length }, (_, i) =>
        updatedHints.includes(i) ? "GREEN" : undefined,
      );
      copy[rowIndex] = hintStatus;
      return copy;
    });
  };

  return (
    <div className="flex flex-col items-center h-max my-auto pt-4 pb-2">
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : PLAYER_LEVEL >= data.length ? (
        <LevelCompleteDialog
          onConfirm={() => {
            localStorage.setItem(`playerLevel-${level}`, "0");
            reset();
          }}
        />
      ) : (
        <>
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

          <div className="flex flex-row items-center w-full my-4 max-w-2xl">
            <HintDialog data={data[PLAYER_LEVEL]} />

            <Button
              variant="secondary"
              className="ml-auto relative"
              size="sm"
              disabled={
                hintIndex.length >= word.length || !canBuyHints("CHARACTER")
              }
              onClick={handleHintCharacter}
            >
              <SearchAlert />
              <div className="absolute -bottom-1 -right-1 outline outline-background rounded-full size-4 bg-accent text-foreground text-[clamp(0.4rem,1vw,0.6rem)] flex items-center justify-center">
                $ {HINTS.CHARACTER}
              </div>
            </Button>

            <Button
              variant="secondary"
              className="ml-2 mr-0.5 relative"
              size="sm"
              onClick={() => {
                payHints("KEYBOARD");
                setKeyboardHint(true);
                playHint()
              }}
              disabled={keyboardHint || !canBuyHints("KEYBOARD")}
            >
              <KeyboardIcon />
              <div className="absolute -bottom-1 -right-1 outline outline-background rounded-full size-4 bg-accent text-foreground text-[clamp(0.4rem,1vw,0.6rem)] flex items-center justify-center">
                $ {HINTS.KEYBOARD}
              </div>
            </Button>
          </div>

          <Keyboard
            onKeyPress={(key) => {
              if (isComplete || isFailed) return;

              setGuess((prev) => {
                const newGuess = [...prev];
                const currentRow = [...newGuess[rowIndex]];

                // Find first empty non-hint position
                const targetIndex = currentRow.findIndex(
                  (char, i) => char === "" && !hintIndex.includes(i),
                );

                if (targetIndex === -1) return prev;

                currentRow[targetIndex] = key;
                newGuess[rowIndex] = currentRow;

                return newGuess;
              });
            }}
            onDelete={() => {
              if (isComplete || isFailed) return;

              setGuess((prev) => {
                const newGuess = [...prev];
                const currentRow = [...newGuess[rowIndex]];

                // Find last filled non-hint position
                for (let i = currentRow.length - 1; i >= 0; i--) {
                  if (currentRow[i] !== "" && !hintIndex.includes(i)) {
                    currentRow[i] = "";
                    break;
                  }
                }

                newGuess[rowIndex] = currentRow;
                return newGuess;
              });
            }}
            isHintActive={keyboardHint}
            word={word}
          />
          <Button
            className="mt-4"
            onClick={handleSubmit}
            disabled={guess[rowIndex]?.includes("")}
          >
            Submit Word
            <CheckCircle />
          </Button>
        </>
      )}
    </div>
  );
}

const Row = ({
  columns,
  guess,
  status,
}: {
  columns: number;
  guess?: string[];
  status?: Array<Status | undefined>;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-0.5">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            "w-10 h-10 rounded flex items-center justify-center bg-muted text-[clamp(0.5rem,3vw,1rem)] tile",
            status && status[colIndex] && "tile-reveal",
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
