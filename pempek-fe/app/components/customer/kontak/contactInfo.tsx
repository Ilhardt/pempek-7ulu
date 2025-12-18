import React from "react";

interface ContactInfoProps {
  contact1: string;
  contact2: string;
  operatingHours: string;
  address: string;
}

export default function ContactInfo({
  contact1,
  contact2,
  operatingHours,
  address,
}: ContactInfoProps) {
  const formatPhoneForHref = (phone: string) => {
    return phone.replace(/[^0-9+]/g, "");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Call Us:</h3>
        <div className="space-y-2">
          {contact1 && (
            <a
              href={`tel:${formatPhoneForHref(contact1)}`}
              className="block text-2xl font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              {contact1}
            </a>
          )}
          {contact2 && (
            <a
              href={`tel:${formatPhoneForHref(contact2)}`}
              className="block text-2xl font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              {contact2}
            </a>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Hours:</h3>
        <div className="space-y-1">
          <p className="text-lg text-white whitespace-pre-line">
            {operatingHours}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Our Location:</h3>
        <div className="space-y-1">
          <p className="text-lg text-white leading-relaxed">{address}</p>
        </div>
      </div>
    </div>
  );
}
