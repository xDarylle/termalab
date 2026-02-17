export const LoadLevel = (level: string) => {
  switch (level) {
    case "easy":
      return import("../data/easy");
    case "medium":
      return import("../data/medium");
    case "hard":
      return import("../data/hard");
    default:
      throw new Error("Invalid level");
  }
};
