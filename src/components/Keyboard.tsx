
import { useAudio } from '@/hooks/useAudio'
import { Button } from './ui/button'

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export default function Keyboard({
  onKeyPress,
  onDelete,
}: {
  onKeyPress?: (key: string) => void
  onDelete?: () => void
}) {
    const { playKeyPress } = useAudio()
  return (
    <div className="w-full max-w-2xl mx-auto px-2 select-none mt-auto">
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
              <Key key={key} label={key} onClick={() => onKeyPress?.(key)} />
            ))}

            {/* Delete key on last row */}
            {rowIndex === 2 && (
              <Button
                onClick={() => {
                  playKeyPress()
                  onDelete?.()
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
  )
}

function Key({ label, onClick }: { label: string; onClick?: () => void }) {
  const { playKeyPress } = useAudio()
  
  const handleClick = () => {
    playKeyPress()
    onClick?.()
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="outline"
      className="p-0 flex-1 h-full rounded text-lg bg-card dark:bg-card active:bg-black/5 dark:active:bg-black/5 transition-none"
    >
      {label}
    </Button>
  )
}
