export type Status = "GREEN" | "YELLOW" | "GRAY";

export function getStatus(guess: string, word: string): Array<Status> {
  const length = word.length;
  const feedback: Array<Status> = new Array(length);
  const targetUsed: Array<boolean> = new Array(length).fill(false);
  const guessUsed: Array<boolean> = new Array(length).fill(false);

  for (let i = 0; i < length; i++) {
    if (guess[i] === word[i]) {
      feedback[i] = "GREEN";
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  for (let i = 0; i < length; i++) {
    if (guessUsed[i]) continue;

    let foundYellow = false;
    for (let j = 0; j < length; j++) {
      if (!targetUsed[j] && guess[i] === word[j]) {
        feedback[i] = "YELLOW";
        targetUsed[j] = true;
        foundYellow = true;
        break;
      }
    }

    if (!foundYellow) {
      feedback[i] = "GRAY";
    }
  }

  return feedback;
}
