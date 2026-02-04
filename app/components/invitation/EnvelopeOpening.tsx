import { useState, useEffect } from "react";
import { asset } from "~/utils/assets";

interface EnvelopeOpeningProps {
  children: React.ReactNode;
}

export function EnvelopeOpening({ children }: EnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const handleOpen = () => {
    if (isOpening || isFullyOpen) return;
    setIsOpening(true);

    // Move flap behind after it's halfway rotated
    setTimeout(() => {
      setFlapBehind(true);
    }, 900);

    // After flap animation, show white flash
    setTimeout(() => {
      setShowWhiteFlash(true);
    }, 1600);

    // Start showing content with blur
    setTimeout(() => {
      setShowContent(true);
    }, 2000);

    // Fully reveal content
    setTimeout(() => {
      setIsFullyOpen(true);
    }, 3000);
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

  // Altura como referencia principal (proporción ~1.44:1)
  // En móvil: altura completa, ancho se desborda creando efecto zoom
  const envelopeHeight = "100vh";
  const envelopeWidth = "calc(100vh * 1.44)";

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.91)",
        }}
      />

      {/* Envelope Wrapper with rotation */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: showWhiteFlash ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      >
        {/* Envelope Container - rectangular */}
        <div
          className="relative"
          style={{
            width: envelopeWidth,
            height: envelopeHeight,
          }}
        >
          {/* Envelope Back - the base rectangle */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
            }}
          />

          {/* Bottom Flap - Triangle pointing up (opens downward) */}
          <div
            className="absolute bottom-0 left-0 right-0 origin-bottom transition-transform duration-[1800ms] ease-in-out"
            style={{
              height: "75%",
              filter: `brightness(0.94) drop-shadow(0 -8px 16px rgba(0,0,0,0.2))`,
              transformStyle: "preserve-3d",
              transform: isOpening ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: 5,
            }}
          >
            {/* Flap shape with texture */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
                backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Shadow overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, transparent 70%, rgba(0,0,0,0.06) 100%)",
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
              }}
            />
          </div>

          {/* Left Flap - Triangle pointing right */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "50%",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
              zIndex: 10,
            }}
          >
            {/* Shadow overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                filter: "brightness(0.91)",
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              }}
            />
          </div>

          {/* Right Flap - Triangle pointing left */}
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "50%",
              clipPath: "polygon(100% 0, 0% 50%, 100% 100%)",
              backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.91)",
              zIndex: 10,
            }}
          >
            {/* Shadow overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                filter: "brightness(0.91)",
                clipPath: "polygon(100% 0, 0% 50%, 100% 100%)",
              }}
            />
          </div>

          {/* Top Flap - Triangle pointing down (opens) */}
          <div
            className="absolute top-0 left-0 right-0 origin-top transition-transform duration-1800 ease-in-out"
            style={{
              height: "70%",
              filter: `brightness(0.98) drop-shadow(0 8px 16px rgba(0,0,0,0.25))`,
              transformStyle: "preserve-3d",
              transform: isOpening ? "rotateX(-180deg)" : "rotateX(0deg)",
              zIndex: flapBehind ? 5 : 25,
            }}
          >
            {/* Flap shape with texture */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundImage: `url("${asset("/images/bg-fijo.jpg")}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Shadow overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.12) 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </div>

          {/* Wax Seal - positioned at flap tip (70% from top) */}
          <button
            onClick={handleOpen}
            className="absolute left-1/2 z-40 cursor-pointer transition-all duration-300 active:scale-95"
            style={{
              top: "63%",
              width: "min(250px, 50vw)",
              height: "min(250px, 50vw)",
              transform: isOpening
                ? "translate(-50%, -50%) scale(1.2)"
                : "translate(-50%, -50%)",
              opacity: isOpening ? 0 : 1,
              transition: "transform 0.5s ease-out, opacity 0.4s ease-out",
            }}
            aria-label="Abrir invitación"
          >
            <img
              src={asset("/images/sello-nuestra-boda.png")}
              alt="Sello de boda"
              className="w-full h-full object-contain"
              style={{
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))",
              }}
            />
          </button>
        </div>
      </div>

      {/* Tap hint */}
      <p
        className={`absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 text-amber-900/40 font-serif text-[10px] md:text-xs tracking-[0.25em] uppercase z-40 transition-opacity duration-500 ${
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
            opacity: showContent ? 1 : 0,
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
