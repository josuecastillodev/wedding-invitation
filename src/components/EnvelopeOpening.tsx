import { useState, useEffect, type ReactNode } from "react";
import { EVENT_CONFIG } from "../config/event";

interface EnvelopeOpeningProps {
  children: ReactNode;
}

const baseUrl = EVENT_CONFIG.baseUrl;

export function EnvelopeOpening({ children }: EnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const handleOpen = () => {
    if (isOpening || isFullyOpen) return;
    setIsOpening(true);

    setTimeout(() => setFlapBehind(true), 900);
    setTimeout(() => setShowWhiteFlash(true), 1600);
    setTimeout(() => setShowContent(true), 2000);
    setTimeout(() => setIsFullyOpen(true), 3000);
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

  const envelopeHeight = "100vh";
  const envelopeWidth = "calc(100vh * 1.44)";
  const bgImage = `url("${baseUrl}/images/bg-fijo.jpg")`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bgImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.91)",
        }}
      />

      {/* Envelope Wrapper */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: showWhiteFlash ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      >
        {/* Envelope Container */}
        <div
          className="relative"
          style={{ width: envelopeWidth, height: envelopeHeight }}
        >
          {/* Envelope Back */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: bgImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
            }}
          />

          {/* Bottom Flap */}
          <div
            className="absolute bottom-0 left-0 right-0 origin-bottom transition-transform duration-[1800ms] ease-in-out"
            style={{
              height: "75%",
              filter:
                "brightness(0.94) drop-shadow(0 -8px 16px rgba(0,0,0,0.2))",
              transformStyle: "preserve-3d",
              transform: isOpening ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: 5,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
                backgroundImage: bgImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, transparent 70%, rgba(0,0,0,0.06) 100%)",
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
              }}
            />
          </div>

          {/* Left Flap */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "50%",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              backgroundImage: bgImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
              zIndex: 10,
            }}
          />

          {/* Right Flap */}
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "50%",
              clipPath: "polygon(100% 0, 0% 50%, 100% 100%)",
              backgroundImage: bgImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
              zIndex: 10,
            }}
          />

          {/* Top Flap */}
          <div
            className="absolute top-0 left-0 right-0 origin-top transition-transform duration-[1800ms] ease-in-out"
            style={{
              height: "70%",
              filter:
                "brightness(0.98) drop-shadow(0 8px 16px rgba(0,0,0,0.25))",
              transformStyle: "preserve-3d",
              transform: isOpening ? "rotateX(-180deg)" : "rotateX(0deg)",
              zIndex: flapBehind ? 5 : 25,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundImage: bgImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.12) 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </div>

          {/* Wax Seal */}
          <button
            onClick={handleOpen}
            className="absolute left-1/2 z-40 cursor-pointer transition-all duration-300 active:scale-95"
            style={{
              top: "65%",
              width: "min(350px, 50vw)",
              height: "min(350px, 50vw)",
              transform: isOpening
                ? "translate(-50%, -50%) scale(1.2)"
                : "translate(-50%, -50%)",
              opacity: isOpening ? 0 : 1,
              transition: "transform 0.5s ease-out, opacity 0.4s ease-out",
            }}
            aria-label="Abrir invitación"
          >
            <img
              src={`${baseUrl}/images/sello-nuestra-boda.png`}
              alt="Sello de boda"
              className="w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }}
            />
          </button>
        </div>
      </div>

      {/* Tap hint */}
      <p
        className={`absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 text-amber-900/40 font-serif text-md tracking-[0.25em] uppercase z-40 transition-opacity duration-500 ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
      >
        Toca el sello para abrir
      </p>

      {/* White flash overlay */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: showWhiteFlash ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          zIndex: 50,
        }}
      />

      {/* Content with blur reveal */}
      {showContent && (
        <div
          className="absolute inset-0 z-40"
          style={{
            opacity: 1,
            filter: isFullyOpen ? "blur(0px)" : "blur(20px)",
            transform: isFullyOpen ? "scale(1)" : "scale(1.1)",
            transition:
              "opacity 0.8s ease-out, filter 1s ease-out, transform 1s ease-out",
          }}
        >
          {children}
        </div>
      )}

      {/* Final white fade out */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: showContent ? (isFullyOpen ? 0 : 0.7) : 0,
          transition: "opacity 1s ease-out",
          zIndex: 45,
        }}
      />
    </div>
  );
}

export default EnvelopeOpening;
