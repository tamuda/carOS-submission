"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Wifi,
  WifiOff,
  AlertTriangle,
  Search,
  Settings,
  Video,
  BarChart3,
  Zap,
  Brain,
  TrendingUp,
} from "lucide-react";

export default function DemoApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);

  useEffect(() => {
    // Simulate connection failure after a brief search
    const timer = setTimeout(() => {
      setIsSearching(false);
      setConnectionFailed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sf-pro">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image
              src="/logo-02.png"
              alt="CarOS Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">CarOS</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </nav>

      {/* Connection Status */}
      <div className="p-4">
        <Card className="glass-card-premium p-4 backdrop-blur-2xl border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected
                  ? "bg-green-500"
                  : connectionFailed
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {isConnected
                ? "Device Connected"
                : connectionFailed
                ? "Device Disconnected"
                : "Searching..."}
            </span>
          </div>
          {connectionFailed && (
            <p className="text-xs text-white/60">
              No CarOS device found. Connect your device to continue.
            </p>
          )}
        </Card>
      </div>

      {/* Main Content - Using the sick UI we built */}
      <div className="p-4 space-y-4">
        {/* AI Diagnostics - Disabled but with sick styling */}
        <Card className="glass-card-premium p-6 backdrop-blur-2xl border-white/10 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Diagnostics</h3>
              <p className="text-xs text-white/60">
                Real-time car health monitoring
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-white/10 rounded-full">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-0"></div>
            </div>
            <p className="text-sm text-white/60">
              Connect device to run diagnostics
            </p>
          </div>
        </Card>

        {/* AI Video Call - Disabled but with sick styling */}
        <Card className="glass-card-premium p-6 backdrop-blur-2xl border-white/10 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Video Support</h3>
              <p className="text-xs text-white/60">Get help from AI mechanic</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-white/60">Offline</span>
            </div>
            <p className="text-sm text-white/60">
              Connect device to access AI mechanic
            </p>
          </div>
        </Card>

        {/* Predictive Insights - Disabled but with sick styling */}
        <Card className="glass-card-premium p-6 backdrop-blur-2xl border-white/10 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Predictive Insights</h3>
              <p className="text-xs text-white/60">
                Future maintenance predictions
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white/40">--</span>
              </div>
              <div className="h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white/40">--</span>
              </div>
              <div className="h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white/40">--</span>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Connect device to get predictions
            </p>
          </div>
        </Card>
      </div>

      {/* Connection Failed Message */}
      {connectionFailed && (
        <div className="fixed bottom-4 left-4 right-4">
          <Card className="glass-card-premium p-4 backdrop-blur-2xl border-red-500/30 bg-red-900/20">
            <div className="flex items-center gap-3 mb-2">
              <WifiOff className="h-5 w-5 text-red-400" />
              <span className="font-semibold text-red-400">
                No Device Found
              </span>
            </div>
            <p className="text-sm text-white/80">
              Make sure your CarOS device is plugged into the OBD-II port and
              powered on.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
