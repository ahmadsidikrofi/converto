"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Box, Settings, Activity, Link2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { id: "overview", label: "Overview", icon: Box },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

// Right-left slide variants (dir > 0 = moving right, dir < 0 = moving left)
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
  }),
};

const transition = {
  type: "spring",
  stiffness: 340,
  damping: 32,
};

export default function TabsUnderlineRadix() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState(null);
  // direction: 1 = moving right (enter from right), -1 = moving left
  const [direction, setDirection] = useState(1);

  const handleTabChange = (newId) => {
    const prevIdx = tabs.findIndex((t) => t.id === activeTab);
    const nextIdx = tabs.findIndex((t) => t.id === newId);
    setDirection(nextIdx > prevIdx ? 1 : -1);
    setActiveTab(newId);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          variant="line"
          className="flex w-full no-visible-scrollbar! border-b border-border bg-transparent p-0! rounded-none h-auto! gap-0! justify-start!"
          onMouseLeave={() => setHoveredTab(null)}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onMouseEnter={() => setHoveredTab(tab.id)}
                className={cn(
                  "relative flex items-center cursor-pointer justify-center text-sm font-medium transition-colors outline-none whitespace-nowrap bg-transparent",
                  "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                  "dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent dark:data-[state=active]:text-foreground",
                  "border-transparent data-[state=active]:border-transparent shadow-none data-[state=active]:shadow-none after:hidden",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}>
                {/* Pill wrapper — hover bg scoped to text only, stays above the bottom border */}
                <span className="relative flex items-center gap-2 px-4 py-3 rounded-md z-10">
                  {/* Hover highlight — layoutId makes it slide between tabs */}
                  {isHovered && (
                    <motion.span
                      layoutId="radix-tabs-05-hover"
                      className="absolute inset-0 bg-muted/70 rounded-md pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </span>

                {/* Active underline indicator */}
                {isActive && (
                  <motion.div
                    layoutId="radix-tabs-05-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }} />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Slide-animated content — AnimatePresence owns mount/unmount, no TabsContent to cause early hide */}
        <div className="mt-6 relative overflow-hidden min-h-[160px]">
          <AnimatePresence mode="wait" custom={direction}>
            {tabs.map((tab) => {
              if (tab.id !== activeTab) return null;
              return (
                <motion.div
                  key={tab.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm min-h-[160px]">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {tab.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is the detailed view for the {tab.label} section.
                    You can customize this content panel with any components or text you need for your application.
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
