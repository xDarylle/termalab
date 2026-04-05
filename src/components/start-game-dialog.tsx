import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

export const StartGameDialog = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center justify-center"
      >
        <DialogTitle className="font-gummy text-primary text-lg sm:text-xl">
          Welcome to Termalab!
        </DialogTitle>
        <div className="text-xs sm:text-sm text-muted-foreground">
          <ScrollArea className="h-100">
            {/* Header */}
            <section>
              <p className="text-muted-foreground">
                Get ready to challenge your spelling skills and master Physical
                Science terms while earning rewards along the way! 🎮✨
              </p>
            </section>

            {/* Game Mechanics */}
            <section className="mt-5">
              <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 text-foreground">
                Game Mechanics:
              </h2>
              <ul className="list-decimal ml-5 space-y-3">
                <li>
                  Each round, you will be given a definition and or a sample
                  sentence as your clue. Tap the “Hint” button to reveal it.
                </li>
                <li>Type your guess for the correct Physical Science term.</li>
                <li>
                  Just like Wordle, your letters will be highlighted:
                  <ul className="list-none mt-3 space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-6 h-6 bg-green-600 rounded-xs shadow-sm"></span>
                      <span className="text-sm">
                        Correct letter in the correct position
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-6 h-6 bg-yellow-500 rounded-xs shadow-sm"></span>
                      <span className="text-sm">
                        Correct letter but in the wrong position
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-block w-6 h-6 bg-gray-400 rounded-xs shadow-sm border border-border"></span>
                      <span className="text-sm">Letter is not in the word</span>
                    </li>
                  </ul>
                </li>
                <li>You have 6 attempts to get the correct answer.</li>
                <li>
                  Use the hints and letter guides to improve your guesses.
                </li>
                <li className="font-medium text-primary">
                  🎉 Earn 10 coins for every correct answer!
                </li>
              </ul>
            </section>

            {/* Game Levels */}
            <section className="mt-5">
              <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 text-foreground">
                Game Levels:
              </h2>
              <ul className="list-disc ml-5 space-y-2 text-muted-foreground">
                <li>Easy Level Terms from Grade 7 lessons</li>
                <li>Medium Level Terms from Grade 8 lessons</li>
                <li>Difficult Level Terms from Grade 9 lessons</li>
              </ul>
              <p className="mt-4 text-sm italic text-muted-foreground">
                Level up as you go, the higher the level, the more challenging
                the terms! 🚀
              </p>
            </section>

            {/* Bonus Round */}
            <section className="bg-secondary/10 mt-5 p-5 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-3">
                Bonus Round:
              </h2>
              <p className="mb-4">
                Feeling confident? Try the Take Quiz bonus round! 🧠✨
              </p>
              <ul className="list-disc ml-5 space-y-2">
                <li>
                  Answer 10 questions by choosing the correct term based on a
                  definition
                </li>
                <li>Earn 2 coins for each correct answer</li>
                <li>Get a 5 coin bonus if you score a perfect 10!</li>
              </ul>
              <p className="mt-4 font-bold">
                More practice means more rewards! 💰
              </p>
            </section>

            {/* Tips */}
            <section className="mt-5">
              <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2 text-foreground">
                Tips for Players:
              </h2>
              <ul className="list-disc ml-5 space-y-2 text-muted-foreground">
                <li>Understand the definition, it will guide your spelling</li>
                <li>Watch the letter hints carefully</li>
                <li>
                  Do not be afraid to make mistakes, that is part of learning
                </li>
              </ul>
            </section>

            {/* Mission */}
            <footer className="pt-8 pb-5">
              <h2 className="text-lg font-bold text-foreground mb-2 italic underline decoration-primary underline-offset-4">
                Your Mission:
              </h2>
              <p className="text-foreground font-medium">
                Spell the terms correctly, understand their meaning, and collect
                as many coins as you can! The more you play, the more you learn!
                🎯
              </p>
            </footer>
          </ScrollArea>
        </div>
        <DialogFooter className="w-full sm:w-auto">
          <Button onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
