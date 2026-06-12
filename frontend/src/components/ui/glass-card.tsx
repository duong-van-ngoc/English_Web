"use client";

import React, { useRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;

    // Calculate rotation angle
    const angleX = (e.clientY - cardY) / 20;
    const angleY = (cardX - e.clientX) / 20;

    // Temporarily disable transition for real-time smooth mouse tracking
    card.style.transition = "none";
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    card.style.boxShadow = "0px 20px 40px rgba(8, 47, 73, 0.08)";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    // Re-enable smooth transition to return card to rest state
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease";
    card.style.transform = "translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)";
    card.style.boxShadow = "var(--glass-shadow)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel floating-card cursor-default ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
