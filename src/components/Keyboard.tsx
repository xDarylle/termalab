import { useAudio } from "@/hooks/useAudio";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function Keyboard({
  onKeyPress,
  onDelete,
  isHintActive,
  word,
}: {
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  isHintActive?: boolean;
  word?: string;
}) {
  const { playKeyPress } = useAudio();
  return (
    <div className="w-full max-w-xs sm:max-w-96 mx-auto px-2 select-none mt-auto">
      <div className="space-y-1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-center gap-x-0.5 h-12"
          >
            {/* Add side spacing for staggered layout */}
            {rowIndex === 1 && <div className="w-2 sm:w-6" />}
            {rowIndex === 2 && <div className="w-4 sm:w-10" />}

            {row.map((key) => (
              <div key={key} className="relative flex flex-1 h-full">
                <Key
                  label={key}
                  onClick={() => onKeyPress?.(key)}
                  disabled={isHintActive && !word?.includes(key)}
                  isHintActive={isHintActive}
                />
                {isHintActive && word?.includes(key) && (
                  <span className="absolute bg-accent border border-primary rounded h-3 w-3 flex justify-center items-center top-0 right-0 text-[clamp(0.45rem,1vw,0.6rem)] ">
                    {word
                      .split("")
                      .reduce(
                        (total, x) => (x === key ? (total += 1) : total),
                        0,
                      )}
                  </span>
                )}
              </div>
            ))}

            {/* Delete key on last row */}
            {rowIndex === 2 && (
              <Button
                onClick={() => {
                  playKeyPress();
                  onDelete?.();
                }}
                size="sm"
                variant="secondary"
                className="p-0 flex-1 min-w-12 border h-full rounded text-lg bg-red-600 text-white dark:bg-red-600 dark:text-white"
              >
                ⌫
              </Button>
            )}

            {rowIndex === 1 && <div className="w-2 sm:w-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Key({
  label,
  onClick,
  disabled,
  isHintActive,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isHintActive?: boolean;
}) {
  const { playKeyPress } = useAudio();

  const handleClick = () => {
    playKeyPress();
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="outline"
      className={cn(
        "p-0 flex-1 h-full rounded text-base bg-card dark:bg-card active:bg-black/5 dark:active:bg-black/5 transition-none",
        isHintActive && !disabled && "border-primary dark:border-primary",
      )}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
