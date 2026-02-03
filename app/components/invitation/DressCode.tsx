import { SectionWrapper } from "~/components/ui/SectionWrapper";

const PALETTE_COLORS = [
  { name: "Dorado", color: "#C78852" },
  { name: "Oliva", color: "#93AC5A" },
  { name: "Ciruela", color: "#641846" },
  { name: "Negro", color: "#1a1a1a" },
  { name: "Azul marino", color: "#21374A" },
];

export function DressCode() {
  return (
    <section className="text-center mt-24">
      {/* Title */}
      <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.2em] text-text-dark">
        Dress Code
      </h2>
      <p className="font-script text-burgundy text-3xl md:text-4xl mt-2">
        Formal
      </p>

      {/* Desktop layout: two columns */}
      <div className="mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-12 md:items-center max-w-5xl mx-auto">
        {/* Left column: Couple photo + color palette */}
        <div>
          {/* Couple formal photo */}
          <div className="mx-auto max-w-xs md:max-w-sm">
            <img
              src="/images/dresscode-example.png"
              alt="Ejemplo de vestimenta formal"
              className="w-full h-auto"
            />
          </div>

          {/* Color palette */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            {PALETTE_COLORS.map((c) => (
              <div
                key={c.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Right column: Men and Women examples */}
        <div className="mt-10 md:mt-0 space-y-6 md:space-y-8">
          {/* Men section */}
          <div>
            <h3 className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] mb-4">
              Hombres
            </h3>
            <img
              src="/images/dc-men.jpg"
              alt="Ejemplos de vestimenta formal para hombres"
              className="w-full h-auto"
            />
          </div>

          {/* Women section */}
          <div>
            <h3 className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] mb-4">
              Mujeres
            </h3>
            <img
              src="/images/dc-women.jpg"
              alt="Ejemplos de vestimenta formal para mujeres"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
