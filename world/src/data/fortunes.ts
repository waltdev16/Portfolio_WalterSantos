/**
 * Fortune.exe messages. Add, remove or edit freely: one string per fortune.
 * `personal` is empty on purpose — only Walter can write those.
 */

export type FortuneCategory = "developer" | "creative" | "prediction" | "motivation" | "personal";

export const fortuneCategories: Record<FortuneCategory, string> = {
  developer: "Developer humor",
  creative: "Creative thoughts",
  prediction: "Random predictions",
  motivation: "Motivational messages",
  personal: "Personal curiosities",
};

export const fortunes: Record<FortuneCategory, string[]> = {
  developer: [
    "Your code works. Nobody knows why.",
    "It worked on your machine. Your machine is now the server.",
    "The bug was a missing semicolon. It is always a missing semicolon.",
    "Today you will rename a variable and feel unstoppable.",
  ],
  creative: [
    "Less noise. Better design.",
    "Leave one thing out. Then look again.",
    "A blank page is just a canvas with good manners.",
  ],
  prediction: [
    "Your next big idea is still loading.",
    "A plane will fly past your window before the build finishes.",
    "Someone will ask you to fix their printer this week.",
  ],
  motivation: [
    "You probably need one more coffee.",
    "Small commits. Big progress.",
    "Every expert was once stuck on the same error.",
  ],
  personal: [],
};
