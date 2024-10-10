"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function PredictiveInsights() {
  const predictions = [
    {
      metric: "Battery Health",
      current: 94,
      predicted: 86,
      change: -8,
      months: 3,
    },
    {
      metric: "Brake Pad Life",
      current: 78,
      predicted: 45,
      change: -33,
      months: 6,
    },
    {
      metric: "Oil Quality",
      current: 88,
      predicted: 65,
      change: -23,
      months: 2,
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-8 px-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl font-bold mb-2 text-white">
          Predictive Insights
        </h1>
        <p className="text-white/60">Future health forecasts</p>
      </motion.div>

      {/* Main forecast graph */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6 mb-8">
          <h3 className="font-semibold mb-6 text-white">
            Battery Health Forecast
          </h3>

          {/* Graph visualization */}
          <div className="relative h-48 mb-6 pl-12">
            <svg
              className="w-full h-full"
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    stopColor="rgb(255, 255, 255)"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(255, 255, 255)"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line
                x1="0"
                y1="37.5"
                x2="300"
                y2="37.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="75"
                x2="300"
                y2="75"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="112.5"
                x2="300"
                y2="112.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />

              {/* Forecast line */}
              <path
                d="M 0 15 L 75 20 L 150 35 L 225 60 L 300 90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Subtle glow effect */}
              <path
                d="M 0 15 L 75 20 L 150 35 L 225 60 L 300 90"
                fill="none"
                stroke="rgb(255, 255, 255)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.1"
                filter="blur(4px)"
              />
            </svg>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/50">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Prediction text */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm leading-relaxed text-white/80">
              <span className="text-white font-semibold">
                Battery health forecast:
              </span>{" "}
              −8% expected in 3 months. Consider scheduling maintenance around
              month 4.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Prediction Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6">
          <h3 className="font-semibold mb-6 text-white">
            Component Health Forecast
          </h3>

          {/* Table Content */}
          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.metric}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pb-6 border-b border-white/10 last:border-b-0"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white text-base mb-1">
                      {prediction.metric}
                    </h4>
                    <p className="text-xs text-white/40">
                      {prediction.months} month forecast
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
                      prediction.change < -20
                        ? "bg-yellow-500/20 text-yellow-400"
                        : prediction.change < -10
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {prediction.change > 0 ? "+" : ""}
                    {prediction.change}%
                  </div>
                </div>

                {/* Progress Bars with Proper Spacing */}
                <div className="space-y-3">
                  {/* Current Level */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Current</span>
                      <span className="font-semibold text-white px-2 py-1 rounded bg-white/10">
                        {prediction.current}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/80 rounded-full transition-all duration-500"
                          style={{
                            width: `${prediction.current}%`,
                            boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Predicted Level */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">
                        Predicted (+{prediction.months}mo)
                      </span>
                      <span
                        className={`font-semibold px-2 py-1 rounded ${
                          prediction.change < -20
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {prediction.predicted}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            prediction.change < -20
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : "bg-white/70"
                          }`}
                          style={{
                            width: `${prediction.predicted}%`,
                            boxShadow:
                              prediction.change < -20
                                ? "0 0 10px rgba(250, 204, 21, 0.4)"
                                : "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Label */}
                <div className="mt-3 text-xs text-white/40">
                  Status:{" "}
                  {prediction.change < -20
                    ? "⚠️ Action recommended"
                    : prediction.change < -10
                    ? "👀 Monitor closely"
                    : "✓ Healthy"}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
