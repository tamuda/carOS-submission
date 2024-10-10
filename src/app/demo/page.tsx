"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
  Search,
  AlertCircle,
} from "lucide-react";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);

  const demoSteps = [
    {
      title: "Searching for CarOS Device",
      description: "Looking for nearby OBD-II devices...",
      icon: <Search className="h-5 w-5" />,
      duration: 3000,
    },
    {
      title: "Connection Failed",
      description:
        "No CarOS device found. Please connect your device to continue.",
      icon: <AlertCircle className="h-5 w-5" />,
      duration: 0,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentStep < demoSteps.length) {
      if (currentStep === 0) {
        setIsSearching(true);
      }

      if (currentStep === 1) {
        setIsSearching(false);
        setConnectionFailed(true);
        setIsPlaying(false);
      }

      if (currentStep < demoSteps.length - 1) {
        interval = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, demoSteps[currentStep].duration);
      }
    }

    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, demoSteps]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setIsSearching(false);
    setConnectionFailed(false);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setIsSearching(false);
    setConnectionFailed(false);
  };

  return (
    <>
      <style jsx global>{`
        iframe::-webkit-scrollbar {
          display: none;
        }
        iframe {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        {/* iPhone Mockup Container */}
        <div className="relative">
          {/* iPhone Frame */}
          <div className="w-[450px] h-[800px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 py-2 text-white text-sm">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-6 h-3 border border-white rounded-sm"></div>
                </div>
              </div>

              {/* App Content - Shows the actual CarOS app with overlay */}
              <div className="h-full overflow-hidden relative">
                <iframe
                  src="/demo-app"
                  className="w-full h-full border-0 rounded-[2.5rem] overflow-hidden"
                  title="CarOS App Demo"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                />

                {/* Connection Status Overlay */}
                {(isSearching || connectionFailed) && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
                    <Card className="p-6 bg-gray-800 border-gray-700 w-full max-w-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            connectionFailed
                              ? "bg-red-500"
                              : isSearching
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="text-sm">
                          {connectionFailed
                            ? "Device Disconnected"
                            : isSearching
                            ? "Searching..."
                            : "Ready to Connect"}
                        </span>
                      </div>

                      {/* Current Step Display */}
                      {currentStep < demoSteps.length && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {demoSteps[currentStep].icon}
                            <span className="font-semibold text-white">
                              {demoSteps[currentStep].title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            {demoSteps[currentStep].description}
                          </p>

                          {/* Progress Bar for searching */}
                          {isSearching && (
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full animate-pulse"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Connection Failed Message */}
                      {connectionFailed && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-red-400">
                            <WifiOff className="h-5 w-5" />
                            <span className="font-semibold">
                              No Device Found
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Make sure your CarOS device is plugged into the
                            OBD-II port and powered on.
                          </p>
                          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <p className="text-xs text-red-300">
                              In the real app, you would connect your CarOS
                              device to see your car's diagnostics.
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demo Controls Outside Phone */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              onClick={startDemo}
              disabled={isPlaying}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-5 w-5 mr-2" />
              {isPlaying ? "Demo Running..." : "Start Demo"}
            </Button>
            <Button
              onClick={resetDemo}
              variant="outline"
              size="lg"
              className="border-gray-600"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset Demo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
