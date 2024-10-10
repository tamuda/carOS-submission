"use client";

import { House } from "lucide-react";
import Image from "next/image";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (
    screen: "dashboard" | "diagnostics" | "insights" | "profile"
  ) => void;
}

export default function Navigation({
  currentScreen,
  onNavigate,
}: NavigationProps) {
  const navItems = [
    {
      id: "dashboard",
      Icon: House,
      type: "lucide" as const,
      label: "Home",
    },
    {
      id: "diagnostics",
      Icon: null,
      type: "image" as const,
      imageSrc: "/malfunction-indicador.svg",
      label: "Scan",
    },
    {
      id: "insights",
      Icon: null,
      type: "image" as const,
      imageSrc: "/steering-wheel.svg",
      label: "Insights",
    },
    {
      id: "profile",
      Icon: null,
      type: "image" as const,
      imageSrc: "/car.svg",
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div className="glass-card-premium border-t border-white/10 backdrop-blur-2xl mx-4 mb-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around px-4 py-5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 relative ${
                  isActive
                    ? "text-white scale-110"
                    : "text-white/40 hover:text-white/70 hover:scale-105"
                }`}
              >
                {isActive && (
                  <div className="absolute -inset-3 rounded-2xl bg-white/5" />
                )}

                <div className="relative">
                  {item.type === "lucide" && item.Icon && (
                    <item.Icon
                      className="w-6 h-6 relative z-10"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                  {item.type === "image" && item.imageSrc && (
                    <div
                      className={`w-6 h-6 relative z-10 ${
                        isActive ? "opacity-100" : "opacity-40"
                      } transition-opacity`}
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs font-medium tracking-wide ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
