import React from "react";
import { Card } from "@/components/ui/card";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  changeText?: string;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "secondary" | "tertiary" | "error";
}

export function AdminStatCard({
  title,
  value,
  icon,
  changeText,
  trend = "neutral",
  color = "primary",
}: AdminStatCardProps) {
  const iconColors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-accent/10 text-accent",
    error: "bg-error/10 text-error border-error/20",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-500",
    neutral: "text-text-secondary/70",
  };

  return (
    <Card className={`p-6 ${color === "error" ? "border-error/20" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${iconColors[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {changeText && (
          <span className={`text-xs font-bold ${trendColors[trend]}`}>
            {changeText}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-text-secondary/70 mb-1">
        {title}
      </p>
      <p className="text-2xl font-extrabold text-text-primary tracking-tight">
        {value}
      </p>
    </Card>
  );
}
export default AdminStatCard;
