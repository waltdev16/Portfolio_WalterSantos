"use client";

import { useT } from "@/i18n/t";

// Aclaraciones breves; no cambian los datos ni las métricas del proyecto.
const terms: Record<string, [string, string][]> = {
  "linear-regression": [
    ["R²", "Model fit relative to predicting the mean. It is not a percentage of correct predictions."],
    ["MSE", "Mean squared error: the average squared difference between predictions and observed values. Lower is better on the same data and scale."],
  ],
  "maze-decision-trees": [
    ["DFS", "Depth-first search explores a branch before going back. This project uses it to generate the maze."],
    ["BFS", "Breadth-first search explores nearby cells first. It finds a shortest path when every move has the same cost."],
  ],
  "ai-challenge-kmeans-knn": [
    ["KNN", "K-nearest neighbors classifies an example using the labels of nearby examples."],
    ["Silhouette", "A clustering score from -1 to 1. Higher values indicate better separated and more compact groups; it is not classification accuracy."],
    ["pp", "Percentage points: the difference between two percentages, not a relative percentage increase."],
  ],
  "commercial-hotspots": [
    ["K-Means", "Groups locations by similarity. A cluster describes concentration; it does not prove commercial demand."],
    ["KNN", "K-nearest neighbors classifies an example using the labels of nearby examples."],
    ["Leave-One-Out", "Evaluates one example at a time using the remaining examples for training."],
  ],
  "web-app-backend": [
    ["Client / server", "The browser displays the interface. The contact endpoint validates the message on the server before requesting email delivery."],
    ["Walter's World", "A separate Vite application served within the portfolio. Its creative experiences share the language preference."],
  ],
};

export function ProjectGlossary({ slug }: { slug: string }) {
  const t = useT();
  const entries = terms[slug];
  if (!entries) return null;
  return (
    <details className="my-6 border border-line px-5 py-4">
      <summary className="cursor-pointer text-sm font-medium text-fg">{t("How to read these results")}</summary>
      <dl className="mt-5 grid gap-5 text-sm leading-relaxed sm:grid-cols-2">
        {entries.map(([label, description]) => (
          <div key={label}>
            <dt className="font-mono text-accent">{t(label)}</dt>
            <dd className="mt-1 text-muted">{t(description)}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
