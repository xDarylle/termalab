import { Volume2, VolumeOff } from 'lucide-react'
import { Button } from './ui/button'
import { useAudio } from '@/hooks/useAudio'

export const ToggleMute = () => {
  const audioContext = useAudio()

  return (
    <Button
      size="sm"
      onClick={audioContext.toggleMute}
      variant={audioContext.muted ? 'outline' : 'default'}
      className="h-8 w-8 sm:h-9 sm:w-9 p-0"
    >
      {audioContext.muted ? <VolumeOff className="size-4 sm:size-5" /> : <Volume2 className="size-4 sm:size-5" />}
    </Button>
  )
}
