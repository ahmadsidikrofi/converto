"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

const DEFAULT_MESSAGES = [
  "Mempersiapkan berkas...",
  "Menginisialisasi modul konversi...",
  "Memproses data secara lokal...",
  "Mengoptimalkan hasil...",
  "Hampir selesai...",
];

export default function ShimmerProgress({
  value: controlledValue,
  statusText,
  messages = DEFAULT_MESSAGES,
  speed = "medium",
  isCompleted: controlledIsCompleted,
  completedMessage = "Konversi Selesai!",
  showPercentage = true,
  variant = "master", // "master" | "inline"
  eta,
  className,
  barClassName,
}) {
  const isControlled = typeof controlledValue === "number";

  const [internalProgress, setInternalProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [internalCompleted, setInternalCompleted] = useState(false);

  const progress = isControlled ? controlledValue : internalProgress;
  const isCompleted =
    typeof controlledIsCompleted === "boolean"
      ? controlledIsCompleted
      : progress >= 100 || internalCompleted;

  // Speed Configuration Mapping for simulated progress
  const config = useMemo(
    () =>
      ({
        slow: { divisor: 50, minDelay: 200, maxJitter: 300, msgInterval: 2400 },
        medium: { divisor: 25, minDelay: 100, maxJitter: 150, msgInterval: 1800 },
        fast: { divisor: 10, minDelay: 30, maxJitter: 70, msgInterval: 1200 },
      })[speed] || { divisor: 25, minDelay: 100, maxJitter: 150, msgInterval: 1800 },
    [speed]
  );

  // Auto-progress simulation if uncontrolled
  useEffect(() => {
    if (isControlled || isCompleted) return;

    let timer;

    const updateProgress = () => {
      setInternalProgress((prev) => {
        if (prev >= 100) {
          setInternalCompleted(true);
          return 100;
        }

        const remaining = 100 - prev;
        const increment = Math.random() * (remaining / config.divisor) + 0.2;
        const next = Math.min(prev + increment, 100);
        if (next >= 100) setInternalCompleted(true);
        return next;
      });

      const delay = Math.random() * config.maxJitter + config.minDelay;
      timer = setTimeout(updateProgress, delay);
    };

    timer = setTimeout(updateProgress, 300);

    return () => clearTimeout(timer);
  }, [isControlled, isCompleted, config]);

  // Message rotation effect - stops when completed
  useEffect(() => {
    if (isCompleted || statusText) return;

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, config.msgInterval);

    return () => clearInterval(messageTimer);
  }, [isCompleted, statusText, messages, config]);

  const currentMessage = statusText || (isCompleted ? completedMessage : messages[messageIndex]);
  const pctValue = Math.round(Math.min(100, Math.max(0, progress)));

  if (variant === "inline") {
    return (
      <div className={cn("w-full flex flex-col gap-1.5", className)}>
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 text-[#e5322d] animate-spin shrink-0" />
            )}
            <span className="truncate">{currentMessage}</span>
          </span>
          {showPercentage && (
            <span className={cn("font-extrabold tabular-nums shrink-0 ml-2", isCompleted ? "text-emerald-500" : "text-[#e5322d]")}>
              {pctValue}%
            </span>
          )}
        </div>

        <div className="relative w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 relative overflow-hidden",
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-[#e5322d] via-rose-500 to-red-600",
              barClassName
            )}
            style={{ width: `${pctValue}%` }}
          >
            {!isCompleted && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-5 shadow-2xl shadow-rose-500/10 transition-all duration-300",
        className
      )}
    >
      {/* Background Ambient Glow */}
      <div
        className={cn(
          "absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-700",
          isCompleted ? "bg-emerald-500/20" : "bg-[#e5322d]/20"
        )}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
        {/* Status Text with Animated Icon */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl flex items-center justify-center transition-colors duration-300",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-[#e5322d]"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 animate-in zoom-in duration-300" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>

          <div className="flex flex-col text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={isCompleted ? "completed" : statusText || messageIndex}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-sm sm:text-base font-extrabold tracking-tight",
                  isCompleted
                    ? "text-emerald-500"
                    : "text-slate-900 dark:text-white"
                )}
              >
                {currentMessage}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
              {isCompleted ? "Seluruh proses telah rampung secara lokal" : "Diproses secara aman di dalam browser Anda (WASM)"}
              {!isCompleted && eta && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 inline-block"></span>
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Sisa waktu: {eta}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Percentage Display */}
        {showPercentage && (
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-2xl sm:text-3xl font-black tracking-tight tabular-nums",
                isCompleted ? "text-emerald-500" : "text-[#e5322d]"
              )}
            >
              {pctValue}
            </span>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">%</span>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full relative">
        <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full border border-slate-200/60 dark:border-slate-700/60">
          {/* Progress Bar Fill with Converto Red Gradient */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 relative overflow-hidden",
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-[#e5322d] via-rose-500 to-red-600",
              barClassName
            )}
            style={{ width: `${pctValue}%` }}
          >
            {/* Shimmer Effect */}
            {!isCompleted && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.8s_infinite]" />
            )}
          </div>
        </div>

        {/* Neon Glow Track */}
        <div
          className={cn(
            "absolute -bottom-1 left-0 h-2 rounded-full transition-all duration-500 blur-md pointer-events-none",
            isCompleted
              ? "bg-emerald-500 opacity-50"
              : "bg-[#e5322d] opacity-60"
          )}
          style={{ width: `${pctValue}%` }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
