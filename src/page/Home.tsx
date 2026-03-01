import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { Sparkles, Star } from "lucide-react";
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
        className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy"
        onClick={playButtonClick}
      >
        {children}
        <div className="ml-auto flex flex-row items-center gap-2 text-xs sm:text-sm font-normal">
          <span>{PLAYER_LEVEL + 1}/10</span>
          <Star fill="yellow" className="text-yellow-200 size-3 sm:size-4" />
        </div>
      </Button>
    </Link>
  );
};

const Title = ({ children }: { children: string }) => {
  const chars = children.split("");
  const animationConfig = useMemo(() => {
    return chars.map(() => ({
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <div className="flex flex-row items-center gap-0.5 py-4 sm:py-8">
      {chars.map((char, index) => (
        <div
          key={index}
          className="game-title-float bg-primary text-white font-gummy shadow-xl w-7 sm:w-9 h-10 sm:h-12 rounded text-2xl sm:text-4xl flex items-center justify-center leading-0 font-bold even:translate-y-1 even:sm:even:translate-y-1.5 even:bg-primary/80 text-shadow-2xs"
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
  const { playButtonClick } = useAudio();

  return (
    <div className="flex items-center justify-center flex-1 min-h-0 py-2">
      <Container className="max-w-xs sm:max-w-96 mx-auto w-full">
        <div className="text-center flex flex-col items-center justify-center sm:-translate-y-11">
          <h2 className="ribbon text-white font-gummy text-base sm:text-lg font-medium px-3 sm:px-4 py-1">
            Welcome To
          </h2>
          <Title>TERMALAB</Title>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <MenuButton level="easy">Easy</MenuButton>
          <MenuButton level="medium">Medium</MenuButton>
          <MenuButton level="hard">Hard</MenuButton>
          <Link to="/quiz" replace>
            <Button
              size="lg"
              variant="outline"
              className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy text-primary"
              onClick={playButtonClick}
            >
              Take Quiz
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8  fill-green-600" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
