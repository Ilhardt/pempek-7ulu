"use client";

import React from "react";

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
      <div>
        <h3 className="font-bold mb-3 text-black">Call Us:</h3>
        <a
          href="tel:+6285576947746"
          className="block text-red-600 font-semibold hover:underline"
        >
          +62-855-7694-746
        </a>
      </div>
      <div>
        <h3 className="font-bold mb-3 text-black">Hours:</h3>
        <p className="text-gray-700">Setiap Hari 09:00 - 20:00 WIB</p>
      </div>
      <div>
        <h3 className="font-bold mb-3 text-black">Location:</h3>
        <p className="text-gray-700">
          Jl. Rawamangun Selatan No.3, Jakarta
        </p>
      </div>
    </div>
  );
}