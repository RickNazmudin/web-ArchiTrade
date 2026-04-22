import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-appPrimary/30 selection:text-appPrimary">
      {/* ── BACKGROUND EFFECTS ──────────────────────────────── */}
      
      {/* 1. Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" 
        />
      </div>

      {/* 2. Grain Effect Overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.03] animate-pulse-slow">
        <div 
          className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/noise_yvdidf.gif')]" 
        />
      </div>

      {/* 3. Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-appPrimary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
