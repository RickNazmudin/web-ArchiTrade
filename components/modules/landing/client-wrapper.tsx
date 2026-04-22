// components/modules/landing/client-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamic import untuk HeroVideoDialogDemo
const HeroVideoDialogDemoClient = dynamic(
  () => import("./video-card").then((mod) => mod.HeroVideoDialogDemo),
  { ssr: false },
);

// Dynamic import untuk WorldMapDemo
const WorldMapDemoClient = dynamic(
  () => import("./world-map-demo").then((mod) => mod.WorldMapDemo),
  { ssr: false },
);

// Dynamic import untuk MarqueeDemo
const MarqueeDemoClient = dynamic(
  () => import("./marquee").then((mod) => mod.MarqueeDemo),
  { ssr: false },
);

// Dynamic import untuk ToolsMarquee
const ToolsMarqueeClient = dynamic(
  () => import("./fold-image").then((mod) => mod.ToolsMarquee),
  { ssr: false },
);

// Dynamic import untuk TextRevealDemo
const TextRevealDemoClient = dynamic(
  () => import("./text-revel-demo").then((mod) => mod.TextRevealDemo),
  { ssr: false },
);

// Dynamic import untuk CardScroll
const CardScrollClient = dynamic(
  () => import("@/components/ui/scroll-element"),
  { ssr: false },
);

export function HeroVideoDialogWrapper() {
  return <HeroVideoDialogDemoClient />;
}

export function WorldMapWrapper() {
  return <WorldMapDemoClient />;
}

export function MarqueeWrapper() {
  return <MarqueeDemoClient />;
}

export function ToolsMarqueeWrapper() {
  return <ToolsMarqueeClient />;
}

export function TextRevealWrapper() {
  return <TextRevealDemoClient />;
}

export function CardScrollWrapper() {
  return <CardScrollClient />;
}
