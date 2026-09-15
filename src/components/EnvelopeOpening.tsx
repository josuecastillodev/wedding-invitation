import { useState, useEffect, type ReactNode } from "react";
import { EVENT_CONFIG } from "../config/event";

interface EnvelopeOpeningProps {
  children: ReactNode;
}

const baseUrl = EVENT_CONFIG.baseUrl;

// Textura tipo acuarela generada con ruido SVG (feTurbulence), usada como
// overlay con mix-blend-mode "overlay" sobre el rojo del sobre.
const watercolorTexture = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
    <filter id='w' x='0%' y='0%' width='100%' height='100%'>
      <feTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='3' seed='7' stitchTiles='stitch' x='0' y='0' width='320' height='320' result='n' />
      <feColorMatrix in='n' type='matrix' values='
        0.25 0.25 0.25 0 0.2
        0.25 0.25 0.25 0 0.2
        0.25 0.25 0.25 0 0.2
        0.35 0.35 0.35 0 0.05' />
    </filter>
    <rect width='100%' height='100%' filter='url(#w)' />
  </svg>`
)}`;

export function EnvelopeOpening({ children }: EnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const handleOpen = () => {
    if (isOpening || isFullyOpen) return;
    setIsOpening(true);

    setTimeout(() => setShowWhiteFlash(true), 1000);
    setTimeout(() => setShowContent(true), 1400);
    setTimeout(() => setIsFullyOpen(true), 2400);
  };

  useEffect(() => {
    if (!isFullyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullyOpen]);

  if (isFullyOpen) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 px-6 bg-paper"
      style={{
        backgroundImage: `url("${baseUrl}/images/bg-fijo.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Texto */}
      <div
        className="text-center transition-opacity duration-500"
        style={{ opacity: isOpening ? 0 : 1 }}
      >
        <p className="font-serif text-ink text-xl md:text-2xl leading-snug">
          Querido invitado, se dice que…
        </p>
        <p className="font-script text-accent text-5xl md:text-6xl mt-3">
          Nos casamos
        </p>
      </div>

      {/* Sobre */}
      <div className="relative w-64 md:w-80">
        <button
          onClick={handleOpen}
          aria-label="Abrir invitación"
          className="relative block w-full cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full aspect-[3/2] rounded-lg shadow-xl overflow-hidden"
            style={{
              transform: isOpening ? "scale(0.92)" : "scale(1)",
              opacity: isOpening ? 0 : 1,
              transition: "transform 0.6s ease-in, opacity 0.6s ease-in 0.5s",
            }}
          >
            {/* Cuerpo del sobre */}
            <div className="absolute inset-0 rounded-lg bg-[#a8362f]" />

            {/* Pliegues laterales e inferior */}
            <div
              className="absolute inset-0 bg-[#8f2c26]"
              style={{ clipPath: "polygon(0 0, 50% 58%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#8f2c26]"
              style={{ clipPath: "polygon(100% 0, 50% 58%, 100% 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#98322b]"
              style={{ clipPath: "polygon(0 100%, 50% 38%, 100% 100%)" }}
            />

            {/* Solapa superior (animada) */}
            <div
              className="absolute top-0 left-0 right-0 origin-top transition-transform duration-[900ms] ease-in-out"
              style={{
                height: "60%",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(160deg, #c2453d 0%, #a8362f 100%)",
                filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.55))",
                transform: isOpening ? "rotateX(-160deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
                zIndex: 10,
              }}
            >
              {/* Sombreado del pliegue */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)",
                }}
              />
            </div>

            {/* Sombra de los pliegues diagonales de la solapa superior */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              style={{
                zIndex: 11,
                opacity: isOpening ? 0 : 1,
                transition: "opacity 0.3s ease-out",
              }}
            >
              <defs>
                <filter id="creaseBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              <line
                x1="0"
                y1="0"
                x2="150"
                y2="120"
                stroke="black"
                strokeOpacity="0.45"
                strokeWidth="18"
                filter="url(#creaseBlur)"
              />
              <line
                x1="300"
                y1="0"
                x2="150"
                y2="120"
                stroke="black"
                strokeOpacity="0.45"
                strokeWidth="18"
                filter="url(#creaseBlur)"
              />
            </svg>

            {/* Textura acuarela */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                backgroundImage: `url("${watercolorTexture}")`,
                backgroundSize: "260px 260px",
                mixBlendMode: "overlay",
                opacity: 0.85,
                zIndex: 12,
              }}
            />

            {/* Sombreado general: luz superior, esquinas inferiores oscuras */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `
                  radial-gradient(70% 55% at 50% 60%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 65%),
                  radial-gradient(65% 60% at 8% 105%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%),
                  radial-gradient(65% 60% at 92% 105%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%),
                  radial-gradient(90% 60% at 50% -10%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 55%)
                `,
                zIndex: 13,
              }}
            />

            {/* Sello */}
            <img
              src={`${baseUrl}/images/sello-nuestra-boda.png`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2"
              style={{
                top: "55%",
                transform: isOpening
                  ? "translate(-50%, -50%) scale(0.7)"
                  : "translate(-50%, -50%) scale(1)",
                width: "38%",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
                opacity: isOpening ? 0 : 1,
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                zIndex: 20,
              }}
            />

          </div>
        </button>

        {/* Ramo de flores (fuera del contexto 3D para que el blend funcione) */}
        <img
          src={`${baseUrl}/images/flower.png`}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute w-[100%] h-auto"
          style={{
            right: "-50%",
            bottom: "-80%",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
            opacity: isOpening ? 0 : 1,
            transition: "opacity 0.4s ease-out",
            zIndex: 15,
          }}
        />
      </div>

      <p
        className="text-ink/40 font-serif text-xs md:text-sm tracking-[0.25em] uppercase transition-opacity duration-500"
        style={{ opacity: isOpening ? 0 : 1 }}
      >
        Toca el sobre para abrir
      </p>

      {/* Flash blanco */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: showWhiteFlash ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          zIndex: 50,
        }}
      />

      {/* Contenido con revelado en blur */}
      {showContent && (
        <div
          className="absolute inset-0 z-40"
          style={{
            filter: isFullyOpen ? "blur(0px)" : "blur(20px)",
            transform: isFullyOpen ? "scale(1)" : "scale(1.1)",
            transition: "filter 1s ease-out, transform 1s ease-out",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default EnvelopeOpening;
