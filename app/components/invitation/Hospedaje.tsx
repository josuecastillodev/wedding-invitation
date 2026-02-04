import { SectionWrapper } from "~/components/ui/SectionWrapper";
import { asset } from "~/utils/assets";

export function Hospedaje() {
  return (
    <SectionWrapper className="text-center">
      {/* Title */}
      <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.15em] text-text-dark">
        Hospedaje
      </h2>

      {/* Hotel Name */}
      <p className="font-script text-burgundy text-3xl md:text-6xl mt-2">
        Nombre del Hotel
      </p>

      {/* Content: Image + Buttons */}
      <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center md:justify-center gap-8 md:gap-16">
        {/* Image */}
        <div className="w-full md:w-auto">
          <img
            src={asset("/images/hospedaje.jpg")}
            alt="Hotel"
            className="w-full md:w-[400px] lg:w-[500px] h-auto object-cover"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-1/2">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 bg-burgundy text-white font-serif text-base md:text-lg tracking-wide text-center hover:bg-burgundy/90 transition-colors "
          >
            Quiero Reservar
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 bg-mauve text-burgundy font-serif text-base md:text-lg tracking-wide text-center hover:bg-mauve/80 transition-colors"
          >
            Más Sobre El Hotel
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 bg-mauve text-burgundy font-serif text-base md:text-lg tracking-wide text-center hover:bg-mauve/80 transition-colors"
          >
            Planes De Pago
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
