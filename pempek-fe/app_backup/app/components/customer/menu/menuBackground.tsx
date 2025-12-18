"use client";

import React from "react";

export default function MenuBackground() {
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://i.imgur.com/2tzo5Kq.png), linear-gradient(to bottom right, #fef3c7, #fed7aa, #fecaca)',
        backgroundColor: '#fef3c7'
      }}
    >
      {/* Overlay agar text tetap terbaca */}
      <div className="absolute inset-0 bg-white/30"></div>
    </div>
  );
}