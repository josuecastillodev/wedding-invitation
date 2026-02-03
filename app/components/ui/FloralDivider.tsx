interface FloralDividerProps {
  variant?: "flor-1" | "flor-2";
  className?: string;
}

export function FloralDivider({
  variant = "flor-1",
  className = "",
}: FloralDividerProps) {
  if (variant === "flor-1") {
    return (
      <svg
        viewBox="0 0 120 140"
        fill="none"
        stroke="#D9C3C3"
        strokeWidth="1"
        className={`w-24 h-28 mx-auto ${className}`}
      >
        {/* Stylized floral line art - leaves and stem */}
        <path d="M60 140 Q60 100 50 80 Q35 55 20 50 Q35 45 50 55 Q58 65 60 80" />
        <path d="M60 140 Q60 100 70 80 Q85 55 100 50 Q85 45 70 55 Q62 65 60 80" />
        <path d="M60 80 Q55 50 40 30 Q50 20 60 35 Q70 20 80 30 Q65 50 60 80" />
        <path d="M60 35 Q58 15 60 0 Q62 15 60 35" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      stroke="#D9C3C3"
      strokeWidth="1"
      className={`w-28 h-24 mx-auto ${className}`}
    >
      {/* Stylized floral line art - horizontal arrangement */}
      <path d="M70 60 Q40 50 20 30 Q30 20 45 35 Q55 50 70 60" />
      <path d="M70 60 Q100 50 120 30 Q110 20 95 35 Q85 50 70 60" />
      <path d="M70 60 Q60 40 50 20 Q65 25 70 40 Q75 25 90 20 Q80 40 70 60" />
      <path d="M70 60 Q65 80 55 100 Q60 90 70 85 Q80 90 85 100 Q75 80 70 60" />
    </svg>
  );
}
