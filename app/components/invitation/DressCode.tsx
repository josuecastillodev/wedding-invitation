import { useInView } from "~/hooks/useInView";
import { asset } from "~/utils/assets";

const PALETTE_COLORS = [
  { name: "Dorado", color: "#C78852" },
  { name: "Oliva", color: "#93AC5A" },
  { name: "Ciruela", color: "#641846" },
  { name: "Negro", color: "#1a1a1a" },
  { name: "Azul marino", color: "#21374A" },
];

export function DressCode() {
  const { ref: titleRef, isInView: titleInView } = useInView({ threshold: 0.3 });
  const { ref: contentRef, isInView: contentInView } = useInView({ threshold: 0.1 });

  return (
    <section className="text-center mt-24">
      {/* Title */}
      <div ref={titleRef}>
        <h2
          className={`font-serif text-2xl md:text-3xl uppercase tracking-[0.2em] text-text-dark transition-all duration-700 ${
            titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Dress Code
        </h2>
        <p
          className={`font-script text-burgundy text-3xl md:text-4xl mt-2 transition-all duration-700 delay-100 ${
            titleInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          Formal
        </p>
      </div>

      {/* Desktop layout: two columns */}
      <div
        ref={contentRef}
        className="mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-12 md:items-center max-w-5xl mx-auto"
      >
        {/* Left column: Couple photo + color palette */}
        <div
          className={`transition-all duration-700 ${
            contentInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 md:-translate-x-8"
          }`}
        >
          {/* Couple formal photo */}
          <div className="mx-auto max-w-xs md:max-w-sm">
            <img
              src={asset("/images/dresscode-example.png")}
              alt="Ejemplo de vestimenta formal"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>

          {/* Color palette */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            {PALETTE_COLORS.map((c, index) => (
              <div
                key={c.name}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-white shadow-sm transition-all duration-500 hover:scale-110 ${
                  contentInView ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{
                  backgroundColor: c.color,
                  transitionDelay: contentInView ? `${300 + index * 100}ms` : "0ms",
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Right column: Men and Women examples */}
        <div
          className={`mt-10 md:mt-0 space-y-6 md:space-y-8 transition-all duration-700 delay-200 ${
            contentInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 md:translate-x-8"
          }`}
        >
          {/* Men section */}
          <div>
            <h3 className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] mb-4">
              Hombres
            </h3>
            <img
              src={asset("/images/dc-men.jpg")}
              alt="Ejemplos de vestimenta formal para hombres"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>

          {/* Women section */}
          <div>
            <h3 className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] mb-4">
              Mujeres
            </h3>
            <img
              src={asset("/images/dc-women.jpg")}
              alt="Ejemplos de vestimenta formal para mujeres"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
