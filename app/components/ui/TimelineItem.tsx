interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  location: string;
  isLast?: boolean;
}

export function TimelineItem({
  icon,
  title,
  time,
  location,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center text-burgundy">
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-mauve mt-2" />}
      </div>
      <div className={`pb-8 ${isLast ? "" : ""}`}>
        <h4 className="text-xs uppercase tracking-[0.2em] text-text-dark font-serif">
          {title}
        </h4>
        <p className="text-burgundy text-sm mt-1">{time}</p>
        <p className="text-text-dark/70 text-sm mt-0.5">{location}</p>
      </div>
    </div>
  );
}
