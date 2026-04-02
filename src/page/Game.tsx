import { useParams } from "react-router";
import { useEffect, useMemo, useState, useCallback, useLayoutEffect, startTransition } from "react";
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
import { HINTS } from "@/components/coin-provider";
import { useCoins } from "@/hooks/useCoins";
import { HintDialog } from "@/components/hint-dialog";
import { LevelCompleteDialog } from "@/components/level-complete-dialog";

const MAX_ROWS = 6;

interface GameState {
  guess: string[][];
  status: Array<Array<Status | undefined>>;
  rowIndex: number;
  hintIndex: number[];
  isComplete: boolean;
  isFailed: boolean;
  keyboardHint: boolean;
}

const createEmptyBoard = (wordLength: number): string[][] =>
  Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: wordLength }, () => ""),
  );

const createInitialState = (wordLength: number): GameState => ({
  guess: createEmptyBoard(wordLength),
  status: [],
  rowIndex: 0,
  hintIndex: [],
  isComplete: false,
  isFailed: false,
  keyboardHint: false,
});

const loadSavedState = (key: string): GameState | null => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        guess: parsed.guess,
        status: parsed.status,
        rowIndex: parsed.rowIndex,
        hintIndex: parsed.hintIndex,
        isComplete: parsed.isComplete,
        isFailed: parsed.isFailed,
        keyboardHint: parsed.keyboardHint,
      };
    } catch {
      return null;
    }
  }
  return null;
};

const getGameStateKey = (level: string | undefined, playerLevel: number) =>
  `gameState-${level}-${playerLevel}`;

export function Game() {
  const { level } = useParams();
  const { addCoins, canBuyHints, payHints } = useCoins();
  const { playButtonClick, playSuccess, playFailure, playHint } = useAudio();

  const [data, setData] = useState<
    { term: string; description: string; sample_text: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [levelRevision, setLevelRevision] = useState(0);

  const playerLevel = useMemo(() => {
    return parseInt(localStorage.getItem(`playerLevel-${level}`) || "0");
  }, [level, levelRevision]);

  const word = useMemo(() => {
    return data[playerLevel]?.term?.toUpperCase().replaceAll(" ", "") || "";
  }, [data, playerLevel]);

  const gameStateKey = getGameStateKey(level, playerLevel);

  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(0),
  );

  useLayoutEffect(() => {
    if (!word) return;

    const saved = loadSavedState(gameStateKey);
    const initialState = saved ?? createInitialState(word.length);

    startTransition(() => {
      setGameState(initialState);
    });
  }, [word, gameStateKey]);

  useEffect(() => {
    if (!level) return;

    LoadLevel(level)
      .then((module) => {
        const loaded = module.default || module;
        setData(loaded);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [level]);

  useEffect(() => {
    if (!word) return;
    localStorage.setItem(gameStateKey, JSON.stringify(gameState));
  }, [gameState, gameStateKey, word]);

  const {
    guess,
    status,
    rowIndex,
    hintIndex,
    isComplete,
    isFailed,
    keyboardHint,
  } = gameState;

  const setGuess = useCallback((updater: (prev: string[][]) => string[][]) => {
    setGameState((prev) => ({ ...prev, guess: updater(prev.guess) }));
  }, []);

  const setStatus = useCallback(
    (updater: (prev: Array<Array<Status | undefined>>) => Array<Array<Status | undefined>>) => {
      setGameState((prev) => ({ ...prev, status: updater(prev.status) }));
    },
    [],
  );

  const setRowIndex = useCallback((value: number) => {
    setGameState((prev) => ({ ...prev, rowIndex: value }));
  }, []);

  const setHintIndex = useCallback((updater: number[] | ((prev: number[]) => number[])) => {
    setGameState((prev) => ({
      ...prev,
      hintIndex: typeof updater === "function" ? updater(prev.hintIndex) : updater,
    }));
  }, []);

  const setIsComplete = useCallback((value: boolean) => {
    setGameState((prev) => ({ ...prev, isComplete: value }));
  }, []);

  const setIsFailed = useCallback((value: boolean) => {
    setGameState((prev) => ({ ...prev, isFailed: value }));
  }, []);

  const setKeyboardHint = useCallback((value: boolean) => {
    setGameState((prev) => ({ ...prev, keyboardHint: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (gameState.guess[rowIndex].includes("")) return;

    playButtonClick();

    const playerGuess = gameState.guess[rowIndex].join("");
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
  }, [
    gameState.guess,
    rowIndex,
    word,
    hintIndex,
    playButtonClick,
    playSuccess,
    playFailure,
    addCoins,
    setStatus,
    setGuess,
    setRowIndex,
    setIsComplete,
    setIsFailed,
  ]);

  const reset = useCallback(() => {
    localStorage.removeItem(gameStateKey);
    setGameState(createInitialState(word.length));
  }, [gameStateKey, word.length]);

  const handleHintCharacter = useCallback(() => {
    if (hintIndex.length >= word.length) return;

    const available = word
      .split("")
      .map((_, i) => i)
      .filter((i) => !hintIndex.includes(i));

    if (available.length === 0) return;

    playHint();
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
  }, [
    hintIndex,
    word,
    rowIndex,
    playHint,
    payHints,
    setHintIndex,
    setGuess,
    setStatus,
  ]);

  return (
    <div className="flex flex-col mx-auto items-center justify-center h-full min-h-0 py-2 sm:py-4 md:w-full">
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : playerLevel >= data.length ? (
        <LevelCompleteDialog
          onConfirm={() => {
            localStorage.setItem(`playerLevel-${level}`, "0");
            setLevelRevision((prev) => prev + 1);
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
                (playerLevel + 1).toString(),
              );
              setLevelRevision((prev) => prev + 1);
              reset();
            }}
          />
          <FailedDialog open={isFailed} onTry={reset} />

          <Container className="max-w-xs sm:max-w-md my-auto mx-auto font-gummy flex flex-col gap-y-2 rounded-md p-3 sm:p-5">
            <div className="flex flex-row items-center justify-between text-xs sm:text-sm">
              <p className="font-medium text-primary">
                {level?.toUpperCase()} LEVEL
              </p>
              <div className="flex flex-row items-center gap-1 sm:gap-2">
                <Star fill="#fcc800" className="text-yellow-400 size-3 sm:size-4" />
                <span>{playerLevel + 1}/{data.length}</span>
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

          <div className="flex flex-row items-center w-full my-2 sm:my-4 max-w-2xl px-2 sm:px-0">
            <HintDialog data={data[playerLevel]} />

            <Button
              variant="secondary"
              className="ml-auto relative"
              size="sm"
              disabled={
                hintIndex.length >= word.length || !canBuyHints("CHARACTER")
              }
              onClick={handleHintCharacter}
            >
              <SearchAlert className="size-4 sm:size-5" />
              <div className="absolute -bottom-1 -right-1 outline outline-background rounded-full size-4 bg-accent text-foreground text-[0.5rem] sm:text-[clamp(0.4rem,1vw,0.6rem)] flex items-center justify-center">
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
                playHint();
              }}
              disabled={keyboardHint || !canBuyHints("KEYBOARD")}
            >
              <KeyboardIcon className="size-4 sm:size-5" />
              <div className="absolute -bottom-1 -right-1 outline outline-background rounded-full size-4 bg-accent text-foreground text-[0.5rem] sm:text-[clamp(0.4rem,1vw,0.6rem)] flex items-center justify-center">
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
            <CheckCircle className="size-4 sm:size-5" />
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
  const getTileSize = () => {
    if (columns <= 5) return "w-9 h-9 sm:w-10 sm:h-10";
    if (columns <= 7) return "w-8 h-8 sm:w-10 sm:h-10";
    return "w-7 h-7 sm:w-9 sm:h-9";
  };

  return (
    <div className="flex flex-row items-center justify-center gap-0.5">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            getTileSize(),
            "rounded flex items-center justify-center bg-muted text-sm sm:text-[clamp(0.5rem,3vw,1rem)] tile",
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
