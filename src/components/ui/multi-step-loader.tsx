"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LoadingState {
  text: string;
}

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
        >
          <div className="relative">
            {/* Glassmorphic container */}
            <div className="glass-card-premium rounded-3xl p-8 min-w-[320px]">
              <LoaderCore loadingStates={loadingStates} value={currentState} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const isActive = index === value;
        const isPast = index < value;

        return (
          <motion.div
            key={index}
            className={cn("flex items-center gap-3 w-full")}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: distance > 2 ? 0 : isPast ? 0.4 : isActive ? 1 : 0.3,
              y: 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Checkmark or Loading Indicator */}
              <div className="relative flex-shrink-0">
                {isPast ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
              </div>

              {/* Text */}
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "text-white"
                    : isPast
                    ? "text-white/40"
                    : "text-white/30"
                )}
              >
                {loadingState.text}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
