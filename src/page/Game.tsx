import { useParams } from 'react-router'
import { useState } from 'react'
import { Lock, Star } from 'lucide-react'
import type { Status } from '@/lib/status'
import { Container } from '@/components/container'
import Keyboard from '@/components/Keyboard'
import { Button } from '@/components/ui/button'
import { getStatus } from '@/lib/status'
import { cn } from '@/lib/utils'
import { SuccessDialog } from '@/components/success-dialog'
import { FailedDialog } from '@/components/failed-dialog'
import { useAudio } from '@/hooks/useAudio'


export function Game() {
  const { level } = useParams()
  const word = 'TERMALAB'
  const [rowIndex, setRowIndex] = useState(0)
  const [guess, setGuess] = useState<Array<string>>([])
  const [status, setStatus] = useState<Array<Array<Status>>>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isFailed, setIsFailed] = useState(false)

  const { playButtonClick, playSuccess, playFailure } = useAudio()

  const handleSubmit = () => {
    if (guess[rowIndex]?.length !== word.length) return

    playButtonClick()

    const newStatus = getStatus(guess[rowIndex], word)
    setStatus((prev) => [...prev, newStatus])

    if (word === guess[rowIndex]) {
      setIsComplete(true)
      playSuccess()
    }
    if (rowIndex === 5 && word !== guess[rowIndex]) {
      setIsFailed(true)
      playFailure()
    }

    setRowIndex((prev) => prev + 1)
  }

  const reset = () => {
    setGuess([])
    setStatus([])
    setRowIndex(0)
    setIsComplete(false)
    setIsFailed(false)
  }

  return (
    <div className="flex flex-col items-center h-max my-auto pt-4 pb-2">
      <SuccessDialog open={isComplete} />
      <FailedDialog open={isFailed} onTry={reset} />
      <Container className="max-w-96 mx-auto my-auto font-gummy flex flex-col gap-y-2 rounded-md">
        <div className="flex flex-row items-center justify-between text-sm">
          <p className="font-medium text-primary">
            {level?.toUpperCase()} LEVEL
          </p>
          <div className="flex flex-row items-center gap-2">
            <Star fill="#fcc800" className="text-yellow-400 size-4" />
            <span>1/50</span>
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
      <Button variant="secondary" className="my-4" size="sm">
        <Lock />
        Unlock Hint
      </Button>
      <Keyboard
        onKeyPress={(key) => {
          setGuess((prev) => {
            if (prev.length < rowIndex + 1) return [...prev, key]
            if (prev[rowIndex]?.length < word.length) {
              return prev.map((g, index) => (index === rowIndex ? g + key : g))
            }
            return prev
          })
        }}
        onDelete={() => {
          setGuess((prev) =>
            prev.map((g, index) => (index === rowIndex ? g.slice(0, -1) : g)),
          )
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
  )
}

const Row = ({
  columns,
  guess,
  status,
}: {
  columns: number
  guess?: string
  status?: Array<Status>
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-0.5">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className={cn(
            'w-10 h-10 rounded flex items-center justify-center bg-muted',
            status && status[colIndex] === 'GREEN' && 'bg-green-500 text-white',
            status &&
              status[colIndex] === 'YELLOW' &&
              'bg-yellow-500 text-white',
            status && status[colIndex] === 'GRAY' && 'bg-gray-500 text-white',
          )}
        >
          {guess && guess[colIndex]}
        </div>
      ))}
    </div>
  )
}
