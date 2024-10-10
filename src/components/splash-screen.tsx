"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden px-8">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white/2 via-transparent to-transparent" />

      <motion.div
        className="relative mb-16"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle glow background */}
        <div
          className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent blur-3xl"
          style={{ animation: "pulse-subtle 4s ease-in-out infinite" }}
        />

        <div
          className="relative w-48 h-48 rounded-full glass-card-premium flex items-center justify-center border-gradient"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <div className="absolute inset-8 rounded-full bg-linear-to-br from-white/5 to-transparent" />

          <div className="relative w-24 h-24">
            <Image
              src="/logo-02.png"
              alt="CarOS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </motion.div>

      <motion.h1
        className="text-7xl font-bold mb-6 text-balance text-center tracking-tight text-white"
        style={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        CarOS
      </motion.h1>
      <motion.p
        className="text-xl text-white/60 text-center text-balance max-w-md leading-relaxed font-light px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        Your car's brain in your pocket.
      </motion.p>

      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onContinue}
          className="group relative px-12 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-500 ease-out"
        >
          <span className="text-white/90 font-medium text-lg tracking-wide">
            Start
          </span>
          <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </motion.div>
    </div>
  );
}
