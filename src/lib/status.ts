export type Status = "GREEN" | "YELLOW" | "GRAY"

export function getStatus(guess: string, word: string): Array<Status> {
    const length = word.length;
    const feedback: Array<Status> = new Array(length);
    const targetUsed: Array<boolean> = new Array(length).fill(false);
    const guessUsed: Array<boolean>  = new Array(length).fill(false);

    // 1. First Pass: Find all GREEN (Correct Spot)
    for (let i = 0; i < length; i++) {
        if (guess[i] === word[i]) {
            feedback[i] = "GREEN";
            targetUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    // 2. Second Pass: Find YELLOW (Wrong Spot) vs GRAY (Absent)
    for (let i = 0; i < length; i++) {
        // Skip if already marked Green
        if (guessUsed[i]) continue;

        let foundYellow = false;
        for (let j = 0; j < length; j++) {
            // If character matches elsewhere and hasn't been "claimed"
            if (!targetUsed[j] && guess[i] === word[j]) {
                feedback[i] = "YELLOW";
                targetUsed[j] = true; // Claim this letter in the target
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