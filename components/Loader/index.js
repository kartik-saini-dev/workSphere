

"use client";

import React from "react";

export default function PageLevelLoader() {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-t-solid border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
}
