import { useState, useEffect } from "react";
import { EVENT_CONFIG } from "../config/event";

const WEDDING_DATE = new Date(`${EVENT_CONFIG.eventDate}T17:30:00`);

function calculateTimeLeft() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
  // Initialize with null to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // Calculate immediately on mount
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show placeholder during SSR/initial load
  const displayTime = timeLeft || { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const units = [
    { value: displayTime.days, label: "DÍAS" },
    { value: displayTime.hours, label: "HRS" },
    { value: displayTime.minutes, label: "MIN" },
    { value: displayTime.seconds, label: "SEG" },
  ];

  return (
    <div className="flex items-center justify-center md:gap-10 gap-8">
      {units.map((unit) => (
        <div key={unit.label} className="flex items-center gap-4 md:gap-6">
          <div className="text-center">
            <span className="text-3xl md:text-4xl font-serif text-text-dark">
              {String(unit.value).padStart(2, "0")}
            </span>
            <p className="text-[10px] uppercase tracking-[0.15em] text-text-dark/70 mt-1">
              {unit.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CountdownTimer;
