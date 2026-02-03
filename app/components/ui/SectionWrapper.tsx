interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}

export function SectionWrapper({
  children,
  className = "",
  bg = "",
}: SectionWrapperProps) {
  return (
    <section className={`px-6 py-16 md:px-20 md:py-24 ${bg} ${className}`}>
      <div className="max-w-screen-md mx-auto">{children}</div>
    </section>
  );
}
