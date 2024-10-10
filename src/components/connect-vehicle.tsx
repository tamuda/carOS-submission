"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { motion } from "framer-motion";

interface ConnectVehicleProps {
  onConnect: () => void;
}

type ConnectionStatus = "idle" | "connecting";

const loadingStates = [
  { text: "Scanning for OBD-II device..." },
  { text: "Device found" },
  { text: "Establishing connection..." },
  { text: "Authenticating..." },
  { text: "Reading vehicle data..." },
  { text: "Connected successfully" },
];

export default function ConnectVehicle({ onConnect }: ConnectVehicleProps) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  const handleConnect = () => {
    setStatus("connecting");
    setTimeout(() => onConnect(), 7000);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-8 relative">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={status === "connecting"}
        duration={1200}
        loop={false}
      />

      <motion.div
        className="relative mb-16"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {status === "connecting" && (
          <>
            {[0, 0.5, 1, 1.5].map((delay) => (
              <div
                key={delay}
                className="absolute inset-0 rounded-full border border-white/20"
                style={{
                  animation: `radar-wave 3s ease-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </>
        )}

        <div
          className={`w-48 h-48 rounded-full glass-card-premium flex items-center justify-center border-gradient transition-all duration-500 ${
            status === "connecting" ? "scale-105" : ""
          }`}
        >
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

          <svg
            className="w-24 h-24 text-white/90 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{
              animation:
                status === "connecting"
                  ? "pulse-subtle 2s ease-in-out infinite"
                  : "none",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>
      </motion.div>

      <motion.h2
        className="text-4xl font-bold mb-4 text-balance text-center tracking-tight text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Connect Your Vehicle
      </motion.h2>
      <motion.p
        className="text-base text-white/60 text-center mb-16 text-balance max-w-sm leading-relaxed font-light px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        Tap to connect your OBD-II device and unlock real-time diagnostics.
      </motion.p>

      {status === "idle" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            onClick={handleConnect}
            size="lg"
            className="bg-white hover:bg-white/90 text-black font-semibold px-16 py-7 text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Connect Device
          </Button>
        </motion.div>
      )}
    </div>
  );
}
