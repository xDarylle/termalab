import { useState, useCallback } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useCoins } from "@/hooks/useCoins";
import { useAudio } from "@/hooks/useAudio";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Coins,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import { Link } from "react-router";
import quizData from "@/data/quiz";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

const QUESTIONS_PER_QUIZ = 10;
const COINS_PER_CORRECT_ANSWER = 2;
const COINS_BONUS_PERFECT_SCORE = 5;

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const QuizPage = () => {
  const { playButtonClick, playSuccess, playFailure } = useAudio();
  const { count: currentCoins, addCoins } = useCoins();
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showFeedback ? 1 : 0)) / QUESTIONS_PER_QUIZ) * 100;

  const startQuiz = useCallback(() => {
    playButtonClick();
    // Shuffle and pick random questions
    const shuffled = shuffleArray(quizData as QuizQuestion[]).slice(0, QUESTIONS_PER_QUIZ);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameState("playing");
  }, [playButtonClick]);

  const handleAnswerSelect = useCallback((choice: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(choice);
    const correct = choice === currentQuestion.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      playSuccess();
      setScore((prev) => prev + 1);
    } else {
      playFailure();
    }
  }, [currentQuestion, showFeedback, playSuccess, playFailure]);

  const handleNext = useCallback(() => {
    playButtonClick();
    if (currentQuestionIndex < QUESTIONS_PER_QUIZ - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz finished - award coins
      const totalCoins = score * COINS_PER_CORRECT_ANSWER;
      const finalBonus = score === QUESTIONS_PER_QUIZ ? COINS_BONUS_PERFECT_SCORE : 0;
      
      // Award coins
      for (let i = 0; i < totalCoins + finalBonus; i += COINS_PER_CORRECT_ANSWER) {
        setTimeout(() => addCoins(COINS_PER_CORRECT_ANSWER), i * 50);
      }
      
      setGameState("finished");
    }
  }, [currentQuestionIndex, score, playButtonClick, addCoins]);

  const getLetterPrefix = (index: number) => {
    return String.fromCharCode(65 + index) + ". ";
  };

  const getPerformanceMessage = () => {
    const percentage = (score / QUESTIONS_PER_QUIZ) * 100;
    if (percentage === 100) return { message: "Perfect Score! You're a Science Star!", emoji: "🌟", color: "text-yellow-500" };
    if (percentage >= 80) return { message: "Excellent Work! Great Job!", emoji: "🎉", color: "text-green-500" };
    if (percentage >= 60) return { message: "Good Job! Keep Learning!", emoji: "👍", color: "text-blue-500" };
    return { message: "Keep Practicing! You'll Do Better Next Time!", emoji: "📚", color: "text-orange-500" };
  };

  // Intro Screen
  if (gameState === "intro") {
    return (
      <div className="flex items-center justify-center flex-1 min-h-0 py-2">
        <Container className="max-w-xs sm:max-w-96 mx-auto w-full">
          <div className="text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 animate-bounce">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-gummy text-primary mb-2">
                Science Quiz Challenge
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm px-2 sm:px-4">
                Test your science knowledge and earn coins!
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-3 sm:p-4 w-full space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">{QUESTIONS_PER_QUIZ}</span>
                </div>
                <span>Questions per quiz</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                </div>
                <span>Earn {COINS_PER_CORRECT_ANSWER} coins per correct answer</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <span>{COINS_BONUS_PERFECT_SCORE} coin bonus for perfect score!</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 w-full">
              <Button
                size="lg"
                className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy"
                onClick={startQuiz}
              >
                Start Quiz
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Link to="/" replace>
                <Button
                  size="lg"
                  variant="outline"
                  className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy"
                  onClick={playButtonClick}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Current Balance: {currentCoins} coins</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Finished Screen
  if (gameState === "finished") {
    const performance = getPerformanceMessage();
    const totalCoinsEarned = score * COINS_PER_CORRECT_ANSWER + (score === QUESTIONS_PER_QUIZ ? COINS_BONUS_PERFECT_SCORE : 0);

    return (
      <div className="flex items-center justify-center flex-1 min-h-0 py-2">
        <Container className="max-w-xs sm:max-w-96 mx-auto w-full">
          <div className="text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            <div className="text-4xl sm:text-6xl animate-bounce">{performance.emoji}</div>
            
            <div>
              <h2 className={cn("text-xl sm:text-2xl font-bold font-gummy mb-2", performance.color)}>
                {performance.message}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                You scored {score} out of {QUESTIONS_PER_QUIZ}
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 sm:p-6 w-full">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-lg sm:text-xl font-bold font-gummy">Quiz Results</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-background rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">Correct Answers</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{score}</p>
                </div>
                <div className="bg-background rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">Wrong Answers</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-500">{QUESTIONS_PER_QUIZ - score}</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  <span className="text-base sm:text-lg font-bold text-yellow-700">
                    +{totalCoinsEarned} Coins Earned!
                  </span>
                </div>
                {score === QUESTIONS_PER_QUIZ && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Includes {COINS_BONUS_PERFECT_SCORE} bonus coins for perfect score!
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 w-full">
              <Button
                size="lg"
                className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy"
                onClick={startQuiz}
              >
                Play Again
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Link to="/" replace>
                <Button
                  size="lg"
                  variant="outline"
                  className="py-4 sm:py-6 w-full text-base sm:text-lg font-medium font-gummy"
                  onClick={playButtonClick}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Total Balance: {currentCoins} coins</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="flex items-center justify-center flex-1 min-h-0 py-2">
      <Container className="max-w-xs sm:max-w-96 mx-auto w-full">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/" replace>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs sm:text-sm h-8"
                onClick={playButtonClick}
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Exit
              </Button>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
              <span className="text-xs sm:text-sm font-medium text-yellow-700">{currentCoins}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {QUESTIONS_PER_QUIZ}</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>

          {/* Question Card */}
          <div className="bg-card border rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs sm:text-sm font-bold text-primary">Q</span>
              </div>
              <p className="text-sm sm:text-lg font-medium leading-relaxed">
                {currentQuestion?.question}
              </p>
            </div>
          </div>

          {/* Answer Choices */}
          <div className="space-y-1.5 sm:space-y-2">
            {currentQuestion?.choices.map((choice, index) => {
              const isSelected = selectedAnswer === choice;
              const isCorrectAnswer = choice === currentQuestion.answer;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  variant={showCorrect ? "default" : showWrong ? "destructive" : "outline"}
                  className={cn(
                    "w-full justify-start text-left py-3 sm:py-6 px-3 sm:px-4 h-auto font-normal text-xs sm:text-base",
                    showCorrect && "bg-green-500 hover:bg-green-500 border-green-500",
                    showWrong && "bg-red-500 hover:bg-red-500 border-red-500",
                    !showFeedback && "hover:bg-accent hover:border-primary/50",
                    isSelected && !showFeedback && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={showFeedback}
                >
                  <span className="font-medium mr-2 shrink-0">
                    {getLetterPrefix(index)}
                  </span>
                  <span className="flex-1">{choice.replace(/^[A-D]\.\s*/, "")}</span>
                  {showCorrect && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                  {showWrong && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                </Button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={cn(
              "rounded-xl p-3 sm:p-4 text-center animate-in fade-in slide-in-from-bottom-2",
              isCorrect ? "bg-green-100 border border-green-200" : "bg-red-100 border border-red-200"
            )}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="font-bold text-green-700 text-sm sm:text-base">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-bold text-red-700 text-sm sm:text-base">Incorrect</span>
                  </>
                )}
              </div>
              {!isCorrect && (
                <p className="text-xs sm:text-sm text-red-600">
                  The correct answer is: {currentQuestion?.answer}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button
              size="lg"
              className="w-full py-4 sm:py-6 text-base sm:text-lg font-medium font-gummy animate-in fade-in slide-in-from-bottom-2"
              onClick={handleNext}
            >
              {currentQuestionIndex < QUESTIONS_PER_QUIZ - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};
