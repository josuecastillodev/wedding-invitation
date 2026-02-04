import { useInView } from "~/hooks/useInView";
import { asset } from "~/utils/assets";

export function AdultsOnlySection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="flex items-center justify-center">
      <div
        className={`relative w-11/12 max-w-[550px] mx-auto transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Decorative flower */}
        <div
          className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 transition-all duration-500 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <img
            src={asset("/images/assistant-asset.svg")}
            alt=""
            loading="lazy"
            className="w-14 h-14 md:w-16 md:h-16"
          />
        </div>

        {/* Card with custom border (gap at top center for flower) */}
        <div className="relative px-8 py-16 md:py-12 border border-t-0 border-gray-300">
          {/* Top border - left segment */}
          <div
            className={`absolute top-0 left-0 w-[calc(50%-50px)] h-px bg-gray-300 origin-left transition-transform duration-700 delay-200 ${
              isInView ? "scale-x-100" : "scale-x-0"
            }`}
          />
          {/* Top border - right segment */}
          <div
            className={`absolute top-0 right-0 w-[calc(50%-50px)] h-px bg-gray-300 origin-right transition-transform duration-700 delay-200 ${
              isInView ? "scale-x-100" : "scale-x-0"
            }`}
          />

          <div className="text-center">
            {/* Main heading */}
            <p
              className={`font-serif text-xl md:text-2xl text-text-dark mb-2 transition-all duration-500 delay-100 ${
                isInView ? "opacity-100" : "opacity-0"
              }`}
            >
              Una celebración
            </p>

            {/* "increíble" - script on desktop, uppercase serif on mobile */}
            <p
              className={`font-script text-5xl mb-2 transition-all duration-500 delay-200 ${
                isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              increíble
            </p>

            {/* Couple names */}
            <p
              className={`font-serif text-xl md:text-2xl text-text-dark mb-10 md:mb-8 transition-all duration-500 delay-300 ${
                isInView ? "opacity-100" : "opacity-0"
              }`}
            >
              para Yareli & Luis.
            </p>

            {/* Adults only notice */}
            <p
              className={`font-serif text-burgundy text-xs md:text-sm uppercase tracking-[0.2em] mb-10 md:mb-8 leading-relaxed transition-all duration-500 delay-400 ${
                isInView ? "opacity-100" : "opacity-0"
              }`}
            >
              ¡Exclusivamente para adultos!
            </p>

            {/* RSVP Button */}
            <a
              href="#rsvp"
              className={`inline-block bg-mauve/60 hover:bg-mauve/80 transition-all duration-300 px-8 py-4 md:py-3 text-burgundy cursor-pointer hover:scale-105 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isInView ? "500ms" : "0ms" }}
            >
              <span className="font-serif text-xl leading-tight">
                Confirma tu asistencia
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
