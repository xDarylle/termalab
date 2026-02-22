import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { Smile, Star } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";

const MenuButton = ({
  children,
  level,
}: {
  children: React.ReactNode;
  level: "easy" | "medium" | "hard";
}) => {
  const { playButtonClick } = useAudio();
  const PLAYER_LEVEL = parseInt(
    localStorage.getItem(`playerLevel-${level}`) || "0",
  );

  return (
    <Link to={`/game/${level}`} replace>
      <Button
        size="lg"
        className="py-6 w-full text-lg font-medium font-gummy"
        onClick={playButtonClick}
      >
        {children}
        <div className="ml-auto flex flex-row items-center gap-2 text-sm font-normal">
          <span>{PLAYER_LEVEL + 1}/50</span>
          <Star fill="yellow" className="text-yellow-200" />
        </div>
      </Button>
    </Link>
  );
};

const Title = ({ children }: { children: string }) => {
  const chars = children.split("");
  // Generate stable random configs once
  const animationConfig = useMemo(() => {
    return chars.map(() => ({
      duration: 3 + Math.random() * 2, // 3s - 5s
      delay: Math.random() * 2, // 0s - 2s
    }));
  }, [children]);

  return (
    <div className="flex flex-row items-center gap-0.5 py-8">
      {chars.map((char, index) => (
        <div
          key={index}
          className="game-title-float bg-primary text-white font-gummy shadow-xl w-9 h-12 rounded text-4xl flex items-center justify-center leading-0 font-bold even:translate-y-1.5 even:bg-primary/80 text-shadow-2xs"
          style={{
            animationDuration: `${animationConfig[index].duration}s`,
            animationDelay: `${animationConfig[index].delay}s`,
          }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

export const HomePage = () => {
  return (
    <div className="flex items-center flex-1">
      <Container className="max-w-96 mx-auto">
        <div className="text-center flex flex-col items-center justify-center -translate-y-11">
          <h2 className="ribbon text-white font-gummy text-lg font-medium">
            Welcome To
          </h2>
          <Title>TERMALAB</Title>
        </div>
        <div className="flex flex-col gap-3">
          <MenuButton level="easy">Easy</MenuButton>
          <MenuButton level="medium">Medium</MenuButton>
          <MenuButton level="hard">Hard</MenuButton>
          <Button
            size="lg"
            variant="outline"
            className="py-6 w-full text-lg font-medium font-gummy text-primary"
          >
            Take Quiz
            <Smile />
          </Button>
        </div>
      </Container>
    </div>
  );
};
