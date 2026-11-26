"use client";

import { useState } from "react";

// Coeficientes calculados con el modelo original.
const SLOPE = 5.697886540600668;
const INTERCEPT = 10.041379310344823;

export function RegressionPredictor({
  t,
}: {
  t: (key: string) => string;
}) {
  const [hours, setHours] = useState(8);

  // Calcula la predicción al cambiar las horas.
  const score = SLOPE * hours + INTERCEPT;

  return (
    <div className="border border-line p-6">

      <p className="type-label mb-6">
        {t("Interactive prediction")}
      </p>

      <div className="flex items-center justify-between">
        <label
          htmlFor="regression-hours"
          className="text-sm text-muted"
        >
          {t("Study hours")}
        </label>

        <span className="font-mono text-lg text-accent">
          {hours.toFixed(1)} h
        </span>
      </div>

      <p id="regression-help" className="mt-3 text-sm leading-relaxed text-muted">
        {t("Move the slider from 0.5 to 15 study hours to see the model estimate. This is not a guaranteed grade.")}
      </p>

      {/* Control de horas */}
      <input
        id="regression-hours"
        type="range"
        min={0.5}
        max={15}
        step={0.5}
        value={hours}
        aria-valuetext={`${hours.toFixed(1)} ${t("Study hours")}`}
        aria-describedby="regression-help"
        onChange={(e) => setHours(Number(e.target.value))}
        className="mt-5 w-full cursor-pointer accent-lime-400"
      />

      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>0.5 h</span>
        <span>15 h</span>
      </div>

      {/* Resultado */}
      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="border border-line p-4 text-center">
          <p className="text-xs text-muted">
            {t("Input (hours)")}
          </p>

          <p className="mt-2 font-display text-3xl">
            {hours.toFixed(1)}
          </p>
        </div>

        <div className="border border-accent p-4 text-center">
          <p className="text-xs text-muted">
            {t("Predicted score")}
          </p>

          <p
            aria-live="polite"
            className="mt-2 font-display text-3xl text-accent"
          >
            {score.toFixed(2)}
          </p>
        </div>

      </div>

      <div className="mt-6 border-t border-line pt-4">
        <p className="font-mono text-xs text-muted">
          y = 5.6979x + 10.0414
        </p>

        <p className="mt-3 text-xs text-muted">
          {t("Educational prediction based on illustrative training data.")}
        </p>
      </div>

    </div>
  );
}