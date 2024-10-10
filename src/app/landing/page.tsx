"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { WaitlistModal } from "@/components/waitlist-modal";
import { useState, useEffect, useRef } from "react";
import {
  Car,
  Brain,
  Camera,
  Shield,
  Zap,
  Smartphone,
  ArrowRight,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const [showImage, setShowImage] = useState(true);
  const thirdTextBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (thirdTextBlockRef.current) {
        const rect = thirdTextBlockRef.current.getBoundingClientRect();
        // Hide image when third text block scrolls past
        if (rect.bottom <= 0) {
          setShowImage(false);
        } else {
          setShowImage(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sf-pro -z-20">
      {/* Hero Section - Fixed Background */}
      <div className="relative">
        {/* Background Image - Fixed, hides after third text */}
        {showImage && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Image
              src="/hand holding phone.png"
              alt="Hand holding phone"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Hero Content */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-transparent">
          {/* CarOS Navbar - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-6 left-6 z-30"
          >
            <a
              href="/landing"
              className="glass-card-premium rounded-2xl px-6 py-3 backdrop-blur-2xl flex items-center gap-3 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/logo-02.png"
                  alt="CarOS Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">CarOS</h1>
            </a>
          </motion.div>

          {/* Tagline and Buttons - Bottom Front */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card-premium rounded-3xl px-8 py-6 backdrop-blur-2xl"
            >
              <p className="text-xl md:text-2xl text-white mb-8 font-medium drop-shadow-lg">
                Your car's brain in your pocket
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg shadow-2xl rounded-2xl"
                  onClick={() => (window.location.href = "/demo")}
                >
                  Try Demo
                </Button>
                <WaitlistModal>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm rounded-2xl"
                  >
                    Join Waitlist
                  </Button>
                </WaitlistModal>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Text Blocks Container - Image visible here */}
        <div className="relative z-20 bg-transparent">
          {/* Sticky Content Overlay - Appears on Scroll */}
          <section className="relative h-screen flex items-center justify-end bg-transparent pr-6 md:pr-16 lg:pr-24 xl:pr-32">
            {/* First Text Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-left z-40 max-w-lg"
            >
              <div className="glass-card-premium rounded-3xl px-12 py-8 backdrop-blur-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  No More Guessing
                </h2>
                <p className="text-xl text-white/80 max-w-2xl">
                  Know what's wrong and what it should cost. No more overpaying
                  on unnecessary repairs.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Second Sticky Content */}
          <section className="relative h-screen flex items-center justify-end bg-transparent pr-6 md:pr-16 lg:pr-24 xl:pr-32">
            {/* Second Text Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-left z-40 max-w-lg"
            >
              <div className="glass-card-premium rounded-3xl px-12 py-8 backdrop-blur-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  AI Mechanic
                </h2>
                <p className="text-xl text-white/80 max-w-2xl">
                  Get AI video support for DIY fixes. Learn to handle small
                  repairs yourself.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Third Sticky Content */}
          <section
            ref={thirdTextBlockRef}
            className="relative h-screen flex items-center justify-end bg-transparent pr-6 md:pr-16 lg:pr-24 xl:pr-32"
          >
            {/* Third Text Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-left z-40 max-w-lg"
            >
              <div className="glass-card-premium rounded-3xl px-12 py-8 backdrop-blur-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  $20 Solution
                </h2>
                <p className="text-xl text-white/80 max-w-2xl">
                  One affordable device. Get alerts, fair estimates, and take
                  control.
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      {/* Features Section - Bento Grid */}
      <section className="py-24 px-6 bg-black relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Intelligence meets automotive
            </h2>
            <p className="text-gray-400 text-lg">
              AI-powered diagnostics that understand your car like never before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Card className="h-full glass-card-premium border-white/10 p-8 hover:border-white/20 transition-all duration-300">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Brain className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Diagnostics</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Advanced machine learning analyzes your vehicle's health
                      in real-time, predicting issues before they become
                      problems.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Video Call Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Video Support</h3>
                <p className="text-gray-400">
                  Connect with AI mechanics through your camera for instant
                  guidance.
                </p>
              </Card>
            </motion.div>

            {/* Security Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-400">
                  Your data stays protected with enterprise-grade security.
                </p>
              </Card>
            </motion.div>

            {/* Performance Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="h-full glass-card border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Real-time Performance
                    </h3>
                    <p className="text-gray-400">
                      Monitor your vehicle's performance metrics and get instant
                      insights.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-gray-400 text-lg">
              Four simple steps to take control of your car
            </p>
          </motion.div>

          <Timeline
            data={[
              {
                title: "Plug In Device",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="h-6 w-6 text-blue-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 1
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Plug the $20 CarOS device into your car's OBD-II port (all
                      cars after 1996 have one). Works with both Android and
                      iPhone.
                    </p>
                  </div>
                ),
              },
              {
                title: "Get Diagnosis",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="h-6 w-6 text-purple-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 2
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Run a quick scan to get instant diagnosis of what's wrong
                      and fair cost estimates. No more guessing or overpaying.
                    </p>
                  </div>
                ),
              },
              {
                title: "Fix Yourself",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Car className="h-6 w-6 text-green-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 3
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Get AI video support to guide you through DIY fixes.
                      Upgrade to $8/month for detailed reports and advanced
                      diagnostics.
                    </p>
                  </div>
                ),
              },
              {
                title: "AI Search",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-yellow-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 4
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Get AI-powered search to find the cheapest quotes from
                      auto shops in your area. Compare prices and save money.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card-premium rounded-3xl p-12 backdrop-blur-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your driving?
            </h2>
            <p className="text-gray-400 text-xl mb-8">
              Experience the future of automotive intelligence today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-2xl"
                onClick={() => (window.location.href = "/demo")}
              >
                Watch Demo
              </Button>
              <WaitlistModal>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm"
                >
                  Join Waitlist
                </Button>
              </WaitlistModal>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
