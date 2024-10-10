"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileSettings() {
  return (
    <div className="min-h-screen pb-24 pt-8 px-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl font-bold mb-2 text-white">Profile</h1>
        <p className="text-white/60">Vehicle and settings</p>
      </motion.div>

      {/* Vehicle card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6 mb-6">
          {/* Vehicle image */}
          <div className="relative w-full h-48 rounded-2xl mb-6 overflow-hidden bg-black/20">
            <Image
              src="/cx 30 side red.png"
              alt="Mazda CX-30"
              fill
              className="object-cover grayscale"
              priority
            />
          </div>

          {/* Vehicle info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 mb-1">Vehicle</p>
              <p className="font-semibold text-lg text-white">
                2023 Mazda CX-30 Turbo
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">VIN</p>
              <p className="font-mono text-sm text-white/80">
                5YJ3E1EA8NF123456
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Last Scan</p>
              <p className="text-sm text-white/80">Today at 2:34 PM</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Settings */}
      <div className="space-y-3 mb-6">
        {[
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            ),
            title: "Voice Assistant",
            subtitle: "Ask CarOS anything",
            toggle: true,
            delay: 0.2,
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            ),
            title: "Notifications",
            subtitle: "Alert preferences",
            toggle: false,
            delay: 0.3,
          },
          {
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            ),
            title: "Advanced Settings",
            subtitle: "Sensor configuration",
            toggle: false,
            delay: 0.4,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: item.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Card className="glass-card border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white/90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/50">{item.subtitle}</p>
                  </div>
                </div>
                {item.toggle ? (
                  <div className="w-12 h-6 bg-white/80 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                  </div>
                ) : (
                  <svg
                    className="w-5 h-5 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs text-white/40 mb-4">Powered by CarOS v1.0</p>
        <Button
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          Disconnect Vehicle
        </Button>
      </motion.div>
    </div>
  );
}
