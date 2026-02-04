import { SectionWrapper } from "~/components/ui/SectionWrapper";
import { useInView } from "~/hooks/useInView";

export function GiftRegistry() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <SectionWrapper className="text-center">
      <div ref={ref}>
        <h2
          className={`font-serif text-2xl md:text-3xl uppercase tracking-widest text-text-dark transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Mesa de Regalos
        </h2>
        <p
          className={`font-script text-burgundy text-5xl mt-6 mb-8 transition-all duration-700 delay-100 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          Liverpool
        </p>
        <a
          href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51590751"
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-burgundy text-white px-6 py-2 inline-block cursor-pointer transition-all duration-500 delay-200 hover:bg-burgundy/90 hover:scale-105 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-lg tracking-[0.3em] mb-1 opacity-80">No. 51590751</p>
        </a>
      </div>
    </SectionWrapper>
  );
}
