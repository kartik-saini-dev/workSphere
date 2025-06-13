"use client";

import React from "react";

export default function ComponentLevelLoader({ text = "Loading...", color = "text-blue-500", size = "w-10 h-10" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Spinning Circle */}
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${size} ${color}`}
      ></div>

      {/* Loading Text */}
      <p className={`text-lg font-medium ${color}`}>{text}</p>
    </div>
  );
}
