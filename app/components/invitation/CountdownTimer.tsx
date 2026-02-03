import { useCountdown } from "~/hooks/useCountdown";

const WEDDING_DATE = new Date("2026-04-10T17:30:00");

export function CountdownTimer() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  const units = [
    { value: days, label: "DÍAS" },
    { value: hours, label: "HRS" },
    { value: minutes, label: "MIN" },
    { value: seconds, label: "SEG" },
  ];

  return (
    <div className="flex items-center justify-center md:gap-10 gap-8">
      {units.map((unit, i) => (
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
