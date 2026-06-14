import React from "react";

// Washi Tape Component with ripped ends
export const WashiTape: React.FC<{ className?: string; rotation?: string; color?: string }> = ({
  className = "",
  rotation = "rotate-[-3deg]",
  color = "bg-amber-100/70 border-amber-200/50"
}) => {
  return (
    <div
      className={`absolute h-8 px-4 py-1 flex items-center justify-center font-mono text-[9px] tracking-widest text-amber-900/60 font-bold border-y border-dashed select-none pointer-events-none z-10 ${rotation} ${color} ${className}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent, white 8px, white calc(100% - 8px), transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, white 8px, white calc(100% - 8px), transparent)"
      }}
    >
      ✖ SUMMER MEMORY ✖
    </div>
  );
};

// Hand-drawn Sun Doodle
export const SunDoodle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`fill-none stroke-amber-500 stroke-[5] stroke-linecap-round stroke-linejoin-round animate-spin-slow ${className}`}
    >
      <circle cx="50" cy="50" r="18" fill="rgba(254, 240, 138, 0.4)" />
      <path d="M50 15 V25" />
      <path d="M50 75 V85" />
      <path d="M15 50 H25" />
      <path d="M75 50 H85" />
      <path d="M25 25 L32 32" />
      <path d="M68 68 L75 75" />
      <path d="M75 25 L68 32" />
      <path d="M32 68 L25 75" />
    </svg>
  );
};

// Cute Hand-drawn Cloud & Sun
export const CloudDoodle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 100 80"
      className={`fill-none stroke-sky-400 stroke-[4] stroke-linecap-round stroke-linejoin-round ${className}`}
    >
      <path d="M25 50 C25 40 33 35 43 35 C48 25 58 20 70 25 C80 30 83 40 80 50 C85 50 90 55 90 62 C90 70 82 73 70 73 H25 C15 73 10 65 10 58 C10 50 18 50 25 50 Z" fill="rgba(224, 242, 254, 0.4)" />
    </svg>
  );
};

// Hand-drawn Flower Doodle
export const FlowerDoodle: React.FC<{ className?: string; color?: string; centerColor?: string }> = ({
  className = "",
  color = "fill-pink-200 stroke-pink-500",
  centerColor = "fill-yellow-300 stroke-yellow-500"
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`stroke-[4] stroke-linecap-round stroke-linejoin-round hover:scale-110 transition-transform ${className}`}
    >
      {/* Flower Petals */}
      <path d="M50 50 C40 30 25 40 50 50 C60 30 75 40 50 50 C40 70 25 60 50 50 C60 70 75 60 50 50 Z" className={color} />
      <path d="M50 50 C30 40 40 25 50 50 C70 40 60 25 50 50 C30 60 40 75 50 50 C70 60 60 75 50 50 Z" className={color} />
      {/* Flower Center */}
      <circle cx="50" cy="50" r="10" className={centerColor} />
    </svg>
  );
};

// Watermelon Doodle
export const WatermelonDoodle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`stroke-[4] stroke-linecap-round stroke-linejoin-round hover:rotate-6 transition-transform ${className}`}
    >
      {/* Green Rind */}
      <path d="M15 45 C35 85 75 85 95 45" fill="none" className="stroke-emerald-500 stroke-[8]" />
      {/* Light Green Inner */}
      <path d="M18 45 C36 82 72 82 92 45" fill="none" className="stroke-green-100 stroke-[3]" />
      {/* Red Flesh */}
      <path d="M21 45 C37 77 69 77 89 45 Z" fill="#fda4af" className="stroke-rose-400 stroke-[3]" />
      {/* Seeds */}
      <circle cx="45" cy="53" r="1.5" fill="#374151" className="stroke-none" />
      <circle cx="55" cy="55" r="1.5" fill="#374151" className="stroke-none" />
      <circle cx="65" cy="51" r="1.5" fill="#374151" className="stroke-none" />
      <circle cx="35" cy="49" r="1.5" fill="#374151" className="stroke-none" />
    </svg>
  );
};

// Handdrawn Heart Doodle
export const HeartDoodle: React.FC<{ className?: string; colorClass?: string }> = ({
  className = "",
  colorClass = "fill-rose-300 stroke-rose-500"
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`stroke-[4] stroke-linecap-round stroke-linejoin-round hover:scale-125 transition-transform ${className}`}
    >
      <path
        d="M50 78 C50 78 15 55 15 35 C15 22 27 15 38 22 C43 25 48 31 50 34 C52 31 57 25 62 22 C73 15 85 22 85 35 C85 55 50 78 50 78 Z"
        className={colorClass}
      />
    </svg>
  );
};

// Handdrawn Sparkling Star
export const SparkleDoodle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`fill-yellow-400 stroke-yellow-600 stroke-[4] stroke-linecap-round stroke-linejoin-round animate-pulse ${className}`}
    >
      <path d="M50 15 L58 38 L81 38 L62 52 L70 75 L50 60 L30 75 L38 52 L19 38 L42 38 Z" />
    </svg>
  );
};

// Handdrawn Push-Pin / Thumbtack
export const PinDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "bg-rose-500"
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}>
      {/* Plastic Cap */}
      <div className={`w-4 h-4 rounded-full shadow-md z-20 ${color} opacity-95 flex items-center justify-center`}>
        <div className="w-1.5 h-1.5 bg-white/70 rounded-full absolute top-0.5 left-1"></div>
      </div>
      {/* Cap stem */}
      <div className={`w-3 h-2 -mt-1 z-10 border-b border-black/10 shadow-sm ${color} rounded-sm`}></div>
      {/* Metal Pin */}
      <div className="w-0.5 h-3 bg-neutral-400 -mt-0.5 shadow-sm"></div>
    </div>
  );
};

// Reusable category sticker emoji helpers
export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "Food & Drink": return "🍹";
    case "Nature": return "🌸";
    case "Chill": return "🧘";
    case "Adventure": return "🏕️";
    case "Travel": return "🌴";
    default: return "☀️";
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Food & Drink": return "bg-orange-100 text-orange-800 border-orange-300";
    case "Nature": return "bg-pink-100 text-pink-800 border-pink-300";
    case "Chill": return "bg-sky-100 text-sky-800 border-sky-300";
    case "Adventure": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Travel": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default: return "bg-amber-100 text-amber-800 border-amber-300";
  }
};
