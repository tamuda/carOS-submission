"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AIVideoCall from "@/components/ai-video-call";
import Image from "next/image";

interface MetricData {
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend: string;
  explanation: string;
  normalRange: string;
  why: string;
  problem?: string;
  aiSolution?: string[];
}

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [aiMessages, setAiMessages] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([]);

  const metrics: MetricData[] = [
    {
      label: "RPM",
      value: "2,450",
      unit: "rpm",
      status: "normal",
      trend: "+2.3%",
      explanation:
        "RPM stands for Revolutions Per Minute. It measures how fast your engine is spinning.",
      normalRange: "800-3,000 RPM (while driving)",
      why: "Your engine has pistons that go up and down. RPM tells you how many times they complete a full cycle in one minute. Higher RPM means your engine is working harder - like how you breathe faster when running vs. walking.",
    },
    {
      label: "Coolant Temp",
      value: "105",
      unit: "°C",
      status: "critical",
      trend: "⚠️ High",
      explanation:
        "Engine coolant temperature shows how hot the liquid cooling your engine is.",
      normalRange: "85-95°C (normal operating temp)",
      why: "Your engine gets VERY hot when running (like an oven!). Coolant is a special liquid that flows through the engine to keep it cool, like how sweating cools you down. If it's too hot, your engine could be damaged.",
      problem:
        "Your coolant temperature is 105°C - higher than the normal 85-95°C range. This could cause engine damage if not addressed.",
      aiSolution: [
        "Pull over safely and turn off the engine to prevent damage",
        "Wait 30 minutes for the engine to cool down completely",
        "Check coolant level (when cool!) - it might be low",
        "Look for leaks under the car or white smoke from exhaust",
        "If coolant is low, add 50/50 mix of coolant and water",
        "If problem persists, have a mechanic check the thermostat and water pump",
      ],
    },
    {
      label: "Battery",
      value: "12.8",
      unit: "V",
      status: "normal",
      trend: "+0.2V",
      explanation:
        "Battery voltage shows how much electrical charge your car battery has.",
      normalRange: "12.4-12.8V (engine off), 13.7-14.7V (running)",
      why: "Your car battery is like a rechargeable phone battery. It provides electricity to start the car and power lights, radio, etc. The alternator (like a charger) keeps it charged while driving. 12.8V means it's fully charged!",
    },
    {
      label: "Voltage",
      value: "14.2",
      unit: "V",
      status: "normal",
      trend: "Optimal",
      explanation:
        "System voltage shows if your alternator is charging the battery properly.",
      normalRange: "13.7-14.7V (while engine is running)",
      why: "This measures the electricity your alternator is producing while the engine runs. Think of the alternator as a generator that turns engine power into electricity to charge your battery and run all electrical systems. 14.2V is perfect!",
    },
  ];

  const handleAIAssist = (metric: MetricData) => {
    setShowAIAssistant(true);
    setAiMessages([
      {
        role: "ai",
        content: `I've detected that your ${metric.label} is ${
          metric.status === "critical"
            ? "critically high"
            : "showing unusual readings"
        }. Let me help you understand and fix this issue.`,
      },
      {
        role: "ai",
        content: `**Problem:** ${metric.problem}`,
      },
    ]);
  };

  const showSolution = () => {
    const metric = metrics.find((m) => m.status === "critical");
    if (metric?.aiSolution) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "What should I do to fix this?",
        },
        {
          role: "ai",
          content:
            "Here's a step-by-step solution:\n\n" +
            metric
              .aiSolution!.map((step, i) => `${i + 1}. ${step}`)
              .join("\n\n"),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-16 px-8">
      <motion.div
        className="mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-baseline gap-4 mb-4">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/logo-02.png"
              alt="CarOS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-5xl font-bold tracking-tight text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            CarOS
          </h1>
        </div>
        <p className="text-lg text-white/60 font-light">
          Real-time vehicle monitoring
        </p>
      </motion.div>

      <motion.div
        className="glass-card-premium rounded-4xl p-12 mb-12 border-gradient relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent" />

        <div className="relative text-center">
          <p className="text-sm text-white/50 mb-2 uppercase tracking-widest font-medium">
            Vehicle Health
          </p>
          <p className="text-lg text-white/80 mb-6 font-medium">
            2023 Mazda CX-30 Turbo
          </p>
          <div
            className="text-8xl font-bold text-white mb-8 tracking-tight"
            style={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            85%
          </div>

          <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent rounded-full"
              style={{ animation: "shimmer 3s infinite" }}
            />
            <div
              className="relative h-full bg-linear-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full"
              style={{
                width: "85%",
                transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  "0 0 20px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              }}
            />
          </div>

          <p className="text-sm text-yellow-400/80 mt-6 font-medium">
            ⚠️ Action required - High coolant temperature detected
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mb-12 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="glass-card rounded-4xl p-20 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 0.8, 1.6, 2.4].map((delay) => (
              <div
                key={delay}
                className="absolute w-40 h-40 rounded-full border border-white/10"
                style={{
                  animation: `radar-wave 5s ease-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <p className="text-sm text-white/60 mb-4 uppercase tracking-widest font-medium">
              2023 Mazda CX-30 Turbo
            </p>
            <div className="relative">
              <div
                className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"
                style={{ animation: "pulse-subtle 4s ease-in-out infinite" }}
              />
              <div className="relative w-84 h-68">
                <Image
                  src="/2026_Mazda_CX30_410x277.png"
                  alt="Mazda CX-30"
                  fill
                  className="object-contain contrast-110 brightness-110"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-12">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            onClick={() => setSelectedMetric(metric)}
            className={`glass-card rounded-3xl p-5 sm:p-7 border-gradient hover:scale-[1.03] transition-all duration-300 cursor-pointer ${
              metric.status === "critical" ? "ring-2 ring-yellow-400/50" : ""
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="text-xs text-white/50 mb-3 sm:mb-4 uppercase tracking-widest font-medium">
              {metric.label}
            </p>
            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <span
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                  metric.status === "critical"
                    ? "text-yellow-400"
                    : "text-white"
                }`}
                style={{ letterSpacing: "-0.02em" }}
              >
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm text-white/50 font-light">
                {metric.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    metric.status === "critical"
                      ? "bg-yellow-400"
                      : "bg-white/80"
                  }`}
                  style={{
                    animation:
                      metric.status === "critical"
                        ? "pulse-subtle 1s ease-in-out infinite"
                        : "pulse-subtle 2.5s ease-in-out infinite",
                  }}
                />
                <span className="text-xs text-white/50 font-light">
                  {metric.status === "critical" ? "Warning" : "Stable"}
                </span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  metric.status === "critical"
                    ? "text-yellow-400"
                    : "text-white"
                }`}
              >
                {metric.trend}
              </span>
            </div>
            {metric.status === "critical" && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-yellow-400/80">
                  Tap for AI assistance
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Metric Explanation Dialog */}
      <Dialog
        open={selectedMetric !== null && !showAIAssistant}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedMetric?.label}
            </DialogTitle>
            <DialogDescription>
              Currently: {selectedMetric?.value} {selectedMetric?.unit}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-2">
                What is this?
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {selectedMetric?.explanation}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-2">
                Normal Range
              </h3>
              <p className="text-sm text-white/70">
                {selectedMetric?.normalRange}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-2">
                Why does this matter?
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {selectedMetric?.why}
              </p>
            </div>

            {selectedMetric?.status === "critical" && (
              <button
                onClick={() => {
                  if (selectedMetric) {
                    handleAIAssist(selectedMetric);
                    setSelectedMetric(null);
                  }
                }}
                className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 ease-out"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="relative w-6 h-6">
                    <Image
                      src="/logo-02.png"
                      alt="CarOS AI"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white font-medium text-base">
                    Get AI Assistance
                  </span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Dialog */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              AI Diagnostic Assistant
            </DialogTitle>
            <DialogDescription>
              Let me help you fix your car's issue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {aiMessages.map((message, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-2xl ${
                  message.role === "ai"
                    ? "glass-card border border-white/10"
                    : "bg-white/5"
                }`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      message.role === "ai"
                        ? "bg-white/10 border border-white/20"
                        : "bg-white/20"
                    } flex items-center justify-center shrink-0`}
                  >
                    {message.role === "ai" ? (
                      <div className="relative w-5 h-5">
                        <Image
                          src="/logo-02.png"
                          alt="CarOS AI"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white/60" />
                    )}
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed flex-1 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}

            {aiMessages.length === 2 && (
              <div className="space-y-3">
                <button
                  onClick={showSolution}
                  className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 ease-out"
                >
                  <span className="text-white font-medium text-base">
                    Show Solution Steps
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button
                  onClick={() => {
                    setShowAIAssistant(false);
                    setShowVideoCall(true);
                  }}
                  className="w-full group relative px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 ease-out"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-white/90 font-medium text-base">
                      Live Video Guidance
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}

            {aiMessages.length > 2 && (
              <button
                onClick={() => {
                  setShowAIAssistant(false);
                  setShowVideoCall(true);
                }}
                className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 ease-out"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                  <span className="text-white font-medium text-base">
                    Get Live Video Guidance
                  </span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Video Call */}
      {showVideoCall && (
        <AIVideoCall
          issueName="High Coolant Temperature (105°C)"
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
}
