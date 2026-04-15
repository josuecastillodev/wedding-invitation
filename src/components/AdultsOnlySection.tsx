import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

const baseUrl = EVENT_CONFIG.baseUrl;

export function AdultsOnlySection() {
  const [tallyUrl, setTallyUrl] = useState(
    `https://tally.so/r/${EVENT_CONFIG.tallyFormId}`
  );

  useEffect(() => {
    // Read URL parameters client-side
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("Nombre") || "";
    const pases = params.get("Pases") || "";

    // Build Tally URL with parameters
    const tallyParams = new URLSearchParams();
    if (nombre) tallyParams.set("Nombre", nombre);
    if (pases) tallyParams.set("Pases", pases);

    const queryString = tallyParams.toString();
    const url = queryString
      ? `https://tally.so/r/${EVENT_CONFIG.tallyFormId}?${queryString}`
      : `https://tally.so/r/${EVENT_CONFIG.tallyFormId}`;

    setTallyUrl(url);
  }, []);

  return (
    <section className="flex items-center justify-center">
      <div className="relative w-11/12 max-w-[550px] mx-auto">
        {/* Decorative flower */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <img
            src={`${baseUrl}/images/assistant-asset.svg`}
            alt=""
            loading="lazy"
            className="w-14 h-14 md:w-16 md:h-16"
          />
        </div>

        {/* Card with custom border */}
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

            {/* "increíble" - script font */}
            <p className="font-script text-5xl mb-2">increíble</p>

            {/* Couple names */}
            <p className="font-serif text-xl md:text-2xl text-text-dark mb-10 md:mb-8">
              para Yareli & Luis.
            </p>

            {/* Adults only notice */}
            <p className="font-serif text-[#4a4c35] text-xs md:text-sm uppercase tracking-[0.2em] mb-10 md:mb-8 leading-relaxed">
              ¡Exclusivamente para adultos!
            </p>

            {/* RSVP Button */}
            <a
              href={tallyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#847d63] hover:bg-[#847d63]/80 transition-all duration-300 px-8 py-4 md:py-3 text-white cursor-pointer hover:scale-105"
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

export default AdultsOnlySection;
