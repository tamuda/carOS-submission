"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import Lottie from "lottie-react";

interface ScanStep {
  id: number;
  title: string;
  instruction: string;
  action: string;
  duration: number;
  readings: string[];
}

const scanSteps: ScanStep[] = [
  {
    id: 1,
    title: "Engine Start",
    instruction: "Start your engine and let it idle",
    action: "Checking idle RPM and engine temperature...",
    duration: 3000,
    readings: ["Idle RPM: 850", "Oil Pressure: Normal", "Engine Temp: 92°C"],
  },
  {
    id: 2,
    title: "Rev Test",
    instruction: "Gently rev the engine to 3000 RPM and hold for 2 seconds",
    action: "Analyzing engine response and acceleration...",
    duration: 4000,
    readings: [
      "Peak RPM: 3,050",
      "Throttle Response: Good",
      "Fuel Trim: +2.3%",
    ],
  },
  {
    id: 3,
    title: "Electrical System",
    instruction: "Turn on your headlights (high beam)",
    action: "Testing battery and alternator load...",
    duration: 3000,
    readings: [
      "Battery Voltage: 14.2V",
      "Alternator: Charging",
      "Load Test: Pass",
    ],
  },
  {
    id: 4,
    title: "Climate Control",
    instruction: "Turn on the AC to maximum cooling",
    action: "Checking AC compressor and cooling system...",
    duration: 3500,
    readings: [
      "AC Pressure: 45 PSI",
      "Compressor: Active",
      "Cabin Temp: Dropping",
    ],
  },
  {
    id: 5,
    title: "Brake System",
    instruction: "Press and hold the brake pedal firmly",
    action: "Testing brake pressure and ABS system...",
    duration: 3000,
    readings: [
      "Brake Pressure: 1,200 PSI",
      "ABS: Functional",
      "Pad Wear: 60% remaining",
    ],
  },
  {
    id: 6,
    title: "Final Analysis",
    instruction: "Return to idle - Analyzing all data...",
    action: "Running AI diagnostics on collected data...",
    duration: 4000,
    readings: ["Data Points: 127", "Anomalies: 2 Found", "Confidence: 94%"],
  },
];

export default function AIDiagnostics() {
  const [scanActive, setScanActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [visibleReadings, setVisibleReadings] = useState<string[]>([]);

  // Quotes states
  const [quotesActive, setQuotesActive] = useState(false);
  const [quoteStep, setQuoteStep] = useState(0);
  const [searching, setSearching] = useState(false);
  const [quotesComplete, setQuotesComplete] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<any>(null);
  const [lottieData, setLottieData] = useState(null);

  // Load Lottie animation
  useEffect(() => {
    fetch("/3drunner.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Lottie data loaded:", data);
        setLottieData(data);
      })
      .catch((error) => {
        console.error("Error loading Lottie animation:", error);
      });
  }, []);

  const diagnostics = [
    {
      code: "P0302",
      title: "Cylinder 2 Misfire Detected",
      description: "Likely spark plug wear. Safe to drive short distances.",
      confidence: 87,
      severity: "medium",
      recommendation: "Replace spark plugs within 2 weeks",
      impact: "Medium",
    },
    {
      code: "P0171",
      title: "System Too Lean (Bank 1)",
      description: "Minor air intake issue detected. Monitor fuel efficiency.",
      confidence: 72,
      severity: "low",
      recommendation: "Check air filter and intake system",
      impact: "Low",
    },
  ];

  const startScan = () => {
    setScanActive(true);
    setCurrentStep(0);
    setScanComplete(false);
    setVisibleReadings([]);
  };

  const proceedToNextStep = () => {
    setScanning(true);
    setVisibleReadings([]);

    const step = scanSteps[currentStep];

    // Show readings one by one
    step.readings.forEach((reading, index) => {
      setTimeout(() => {
        setVisibleReadings((prev) => [...prev, reading]);
      }, (step.duration / step.readings.length) * (index + 1));
    });

    // Move to next step or complete
    setTimeout(() => {
      setScanning(false);
      if (currentStep === scanSteps.length - 1) {
        // Last step - show completion
        setScanComplete(true);
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    }, step.duration);
  };

  const closeScan = () => {
    setScanActive(false);
    setCurrentStep(0);
    setScanning(false);
    setScanComplete(false);
    setVisibleReadings([]);
  };

  // Quote search functions
  const startQuoteSearch = (diagnostic: any) => {
    setSelectedDiagnostic(diagnostic);
    setQuotesActive(true);
    setQuoteStep(0);
    setQuotesComplete(false);
    setSearching(false);
  };

  const proceedQuoteSearch = () => {
    setSearching(true);
    setQuoteStep(1);

    // Simulate AI searching for quotes
    setTimeout(() => {
      setSearching(false);
      setQuotesComplete(true);
    }, 4000);
  };

  const closeQuotes = () => {
    setQuotesActive(false);
    setQuoteStep(0);
    setSearching(false);
    setQuotesComplete(false);
    setSelectedDiagnostic(null);
  };

  const step = scanSteps[currentStep];

  return (
    <div className="min-h-screen pb-24 pt-12 px-6">
      <motion.div
        className="mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-5xl font-bold mb-3 tracking-tight text-white">
          AI Diagnostics
        </h1>
        <p className="text-lg text-white/60 font-light">
          Natural language insights
        </p>
      </motion.div>

      <div className="space-y-5 mb-8">
        {diagnostics.map((diagnostic, index) => (
          <motion.div
            key={diagnostic.code}
            className="glass-card-premium rounded-3xl p-8 border-gradient hover:scale-[1.01] transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Header with code and confidence */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    diagnostic.severity === "medium"
                      ? "bg-yellow-400/80"
                      : "bg-white/80"
                  }`}
                  style={{ animation: "pulse-subtle 2s ease-in-out infinite" }}
                />
                <span className="text-sm font-mono text-white/50 tracking-wider">
                  {diagnostic.code}
                </span>
              </div>

              {/* Premium confidence indicator */}
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="absolute h-full bg-linear-to-r from-white via-white/90 to-white/70 rounded-full"
                    style={{
                      width: `${diagnostic.confidence}%`,
                      transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </div>
                <span className="text-sm text-white font-semibold">
                  {diagnostic.confidence}%
                </span>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-white">
              {diagnostic.title}
            </h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed font-light">
              {diagnostic.description}
            </p>

            {/* Premium recommendation box */}
            <div className="glass-card rounded-2xl p-6 mb-6 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-white/90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-medium">
                    Recommendation
                  </p>
                  <p className="text-sm font-light leading-relaxed text-white/80">
                    {diagnostic.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Impact badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
                Impact:
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  diagnostic.severity === "medium"
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "bg-white/10 text-white/90"
                }`}
              >
                {diagnostic.impact}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 glass-card border-white/20 bg-transparent hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-white"
              >
                View Details
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-white hover:bg-white/90 text-black font-semibold hover:scale-[1.02] transition-all duration-300"
                onClick={() => startQuoteSearch(diagnostic)}
              >
                Find Parts
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button
          onClick={startScan}
          className="w-full bg-white hover:bg-white/90 text-black py-8 text-lg font-semibold rounded-full hover:scale-[1.02] transition-all duration-300 shadow-xl"
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Run Full Scan
        </Button>
      </motion.div>

      {/* Interactive Scan Dialog */}
      <Dialog open={scanActive} onOpenChange={(open) => !open && closeScan()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {scanComplete
                ? "Scan Complete! 🎉"
                : `Step ${currentStep + 1} of ${scanSteps.length}`}
            </DialogTitle>
            <DialogDescription>
              {scanComplete
                ? "Full diagnostic scan completed successfully"
                : step.title}
            </DialogDescription>
          </DialogHeader>

          {!scanComplete ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-white via-white/90 to-white/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / scanSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                />
              </div>

              {/* Instruction Card */}
              <motion.div
                className="glass-card-premium rounded-2xl p-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={currentStep}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                    {scanning ? "⚙️" : "👉"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {scanning ? step.action : step.instruction}
                    </h3>
                    {!scanning && (
                      <p className="text-sm text-white/60">
                        Follow this instruction then tap "Done"
                      </p>
                    )}
                  </div>
                </div>

                {/* Readings */}
                <AnimatePresence>
                  {scanning && visibleReadings.length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                      {visibleReadings.map((reading, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 text-sm"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-white/80 font-mono text-xs">
                            {reading}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {scanning && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm text-white/60">Scanning...</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {!scanning && (
                <Button
                  onClick={proceedToNextStep}
                  className="w-full bg-white hover:bg-white/90 text-black font-semibold py-6"
                >
                  {currentStep === 0
                    ? "Start Scan"
                    : currentStep === scanSteps.length - 1
                    ? "Done - Analyze Results"
                    : "Done - Next Step"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card-premium rounded-2xl p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  All Systems Checked
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  Analyzed 127 data points across 6 vehicle systems
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="glass-card rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-400">94%</div>
                    <div className="text-xs text-white/50">Health Score</div>
                  </div>
                  <div className="glass-card rounded-xl p-3">
                    <div className="text-2xl font-bold text-yellow-400">2</div>
                    <div className="text-xs text-white/50">Issues Found</div>
                  </div>
                  <div className="glass-card rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-xs text-white/50">Systems OK</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={closeScan}
                className="w-full bg-white hover:bg-white/90 text-black font-semibold py-6"
              >
                View Full Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Premium Quotes Search Dialog */}
      <Dialog
        open={quotesActive}
        onOpenChange={(open) => !open && closeQuotes()}
      >
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {quotesComplete
                ? "Best Quotes Found"
                : searching
                ? "AI Searching Rochester"
                : "Get Parts Quotes"}
            </DialogTitle>
            <DialogDescription>
              {quotesComplete
                ? "Found the cheapest parts in your area"
                : searching
                ? "Scanning local suppliers and online stores"
                : `Finding quotes for: ${selectedDiagnostic?.title}`}
            </DialogDescription>
          </DialogHeader>

          {!quotesComplete ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-white via-white/90 to-white/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: searching ? "100%" : "50%",
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                />
              </div>

              {!searching ? (
                <motion.div
                  className="glass-card-premium rounded-2xl p-6"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/logo-02.png"
                          alt="CarOS AI"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        AI Quote Search
                      </h3>
                      <p className="text-sm text-white/60 mb-4">
                        I'll search Rochester area suppliers, online stores, and
                        dealerships to find you the best prices for:
                      </p>
                      <div className="glass-card rounded-xl p-4">
                        <p className="text-sm font-medium text-white/90">
                          {selectedDiagnostic?.title}
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          {selectedDiagnostic?.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="glass-card-premium rounded-2xl p-8 text-center"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {/* 3D Runner Animation */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
                    <div className="relative w-full h-full flex items-center justify-center">
                      {lottieData ? (
                        <Lottie
                          animationData={lottieData}
                          loop={true}
                          autoplay={true}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/40 animate-bounce" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    AI Searching Rochester
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    Scanning 12 local suppliers and 8 online stores
                  </p>

                  <div className="space-y-2">
                    {[
                      "AutoZone - Henrietta",
                      "Advance Auto Parts - Greece",
                      "O'Reilly Auto Parts - Irondequoit",
                      "NAPA Auto Parts - Brighton",
                      "RockAuto.com",
                      "PartsGeek.com",
                    ].map((store, index) => (
                      <motion.div
                        key={store}
                        className="flex items-center gap-3 text-sm"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.3 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-white/80">{store}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {!searching && (
                <button
                  onClick={proceedQuoteSearch}
                  className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 ease-out"
                >
                  <span className="text-white font-medium text-base">
                    Start AI Search
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                className="glass-card-premium rounded-2xl p-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-4">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/logo-02.png"
                        alt="CarOS AI"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Best Quotes Found
                  </h3>
                  <p className="text-sm text-white/60">
                    Found 6 competitive quotes in Rochester area
                  </p>
                </div>

                {/* Quote Results */}
                <div className="space-y-3">
                  {[
                    {
                      store: "AutoZone - Henrietta",
                      price: "$24.99",
                      savings: "Best Price",
                      distance: "2.1 mi",
                    },
                    {
                      store: "RockAuto.com",
                      price: "$26.45",
                      savings: "Free Shipping",
                      distance: "Online",
                    },
                    {
                      store: "Advance Auto Parts",
                      price: "$28.99",
                      savings: "In Stock",
                      distance: "3.2 mi",
                    },
                    {
                      store: "NAPA Auto Parts",
                      price: "$31.50",
                      savings: "Premium Brand",
                      distance: "4.1 mi",
                    },
                  ].map((quote, index) => (
                    <motion.div
                      key={quote.store}
                      className="glass-card rounded-xl p-4 flex items-center justify-between"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {quote.store}
                        </p>
                        <p className="text-xs text-white/50">
                          {quote.distance}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {quote.price}
                        </p>
                        <p className="text-xs text-green-400">
                          {quote.savings}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="flex gap-3">
                <button
                  onClick={closeQuotes}
                  className="flex-1 group relative px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 ease-out"
                >
                  <span className="text-white/90 font-medium text-base">
                    Close
                  </span>
                </button>
                <button
                  onClick={closeQuotes}
                  className="flex-1 group relative px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 ease-out"
                >
                  <span className="text-white font-medium text-base">
                    Get Directions
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
