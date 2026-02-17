import { AppAudioContext, type AudioContextProps } from "@/components/audio-provider"
import { useContext } from "react"

export const useAudio = () => {
  const context = useContext(AppAudioContext)
  return context as AudioContextProps
}