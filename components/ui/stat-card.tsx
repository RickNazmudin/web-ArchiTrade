/**
 * Reusable Stat Card Component untuk Dashboard
 * Menampilkan statistik dengan icon, trend, dan styling yang konsisten
 */

import { StatCardProps } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  value,
  label,
  icon: Icon,
  color,
  bg,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d0d14] border border-white/5 p-5 flex flex-col gap-4 hover:border-white/10 transition-all duration-300 group">
      {/* Background glow effect */}
      <div
        className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 group-hover:opacity-25 transition ${bg}`}
      />

      {/* Header: Icon and Trend */}
      <div className="flex items-start justify-between relative z-10">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Trend Badge */}
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
              trend === "up"
                ? "bg-green-500/10 text-green-400"
                : trend === "down"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-500/10 text-gray-400"
            }`}
          >
            {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
            <span>{trendValue || "0%"}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
