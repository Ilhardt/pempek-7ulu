// components/customer/kontak/ContactHeader.tsx
import React from 'react';

export default function ContactHeader() {
  return (
    <div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
        Kontak Kita
      </h1>
      <p className="text-lg sm:text-xl text-white leading-relaxed">
        Lagi ngidam pempek? Mau pesan banyak buat acara?
      </p>
      <p className="text-lg sm:text-xl text-white leading-relaxed">
        Chat aja kami — kami siap layani dengan cepat dan penuh rasa!
      </p>
    </div>
  );
}