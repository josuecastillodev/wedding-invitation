import { SectionWrapper } from "~/components/ui/SectionWrapper";

export function AdultsOnlySection() {
  return (
    <section className="flex items-center justify-center">
      <div className="relative w-11/12 max-w-[550px] mx-auto">
        {/* Decorative flower */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <img
            src="/images/assistant-asset.svg"
            alt=""
            className="w-14 h-14 md:w-16 md:h-16"
          />
        </div>

        {/* Card with custom border (gap at top center for flower) */}
        <div className="relative px-8 py-16 md:py-12 border border-t-0 border-gray-300">
          {/* Top border - left segment */}
          <div className="absolute top-0 left-0 w-[calc(50%-50px)] h-px bg-gray-300" />
          {/* Top border - right segment */}
          <div className="absolute top-0 right-0 w-[calc(50%-50px)] h-px bg-gray-300" />

          <div className="text-center">
            {/* Main heading */}
            <p className="font-serif text-xl md:text-2xl text-text-dark mb-2">
              Una celebración
            </p>

            {/* "increíble" - script on desktop, uppercase serif on mobile */}
            <p className="font-script text-5xl mb-2">increíble</p>

            {/* Couple names */}
            <p className="font-serif text-xl md:text-2xl text-text-dark mb-10 md:mb-8">
              para Yareli & Luis.
            </p>

            {/* Adults only notice */}
            <p className="font-serif text-burgundy text-xs md:text-sm uppercase tracking-[0.2em] mb-10 md:mb-8 leading-relaxed">
              ¡Exclusivamente para adultos!
            </p>

            {/* RSVP Button */}
            <a
              href="#rsvp"
              className="inline-block bg-mauve/60 hover:bg-mauve/80 transition-colors px-8 py-4 md:py-3 text-burgundy cursor-pointer"
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
