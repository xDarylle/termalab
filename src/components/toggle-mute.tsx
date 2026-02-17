import { Volume2, VolumeOff } from 'lucide-react'
import { Button } from './ui/button'
import { useAudio } from '@/hooks/useAudio'

export const ToggleMute = () => {
  const audioContext = useAudio()

  return (
    <Button
      size="icon"
      onClick={audioContext.toggleMute}
      variant={audioContext.muted ? 'outline' : 'default'}
    >
      {audioContext.muted ? <VolumeOff /> : <Volume2 />}
    </Button>
  )
}
