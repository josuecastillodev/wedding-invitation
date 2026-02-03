import { useState, useEffect } from "react";

interface EnvelopeOpeningProps {
  children: React.ReactNode;
}

export function EnvelopeOpening({ children }: EnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // After animation completes, show content
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
  };

  // Prevent scroll when envelope is closed
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (isOpen) {
    return <>{children}</>;
  }

  const textureStyle = {
    backgroundImage: 'url("/images/bg-fijo.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          ...textureStyle,
          filter: "brightness(0.89)",
        }}
      />

      {/* Envelope Container - maintains square aspect ratio based on width */}
      <div
        className="relative"
        style={{
          width: "min(100vw, 100vh)",
          height: "min(100vw, 100vh)",
        }}
      >
        {/* Envelope Back/Base */}
        <div
          className="absolute inset-0"
          style={{
            ...textureStyle,
            filter: "brightness(0.85)",
          }}
        />

        {/* Top Flap (Triangle) - Opens upward */}
        <div
          className={`absolute top-0 left-0 right-0 origin-top transition-transform duration-1000 ease-in-out ${
            isOpening ? "envelope-flap-open" : ""
          }`}
          style={{
            height: "50%",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            ...textureStyle,
            filter: "brightness(1.0)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transformStyle: "preserve-3d",
            zIndex: isOpening ? 10 : 30,
          }}
        >
          {/* Inner shadow for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.05) 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>

        {/* Left Flap - slightly lighter (light from left) */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: "50%",
            clipPath: "polygon(0 0, 0 100%, 100% 50%)",
            ...textureStyle,
            filter: "brightness(0.89)",
            zIndex: 15,
          }}
        />

        {/* Right Flap - slightly darker */}
        <div
          className="absolute right-0 top-0 bottom-0"
          style={{
            width: "50%",
            clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
            ...textureStyle,
            filter: "brightness(0.89)",
            zIndex: 15,
          }}
        />

        {/* Wax Seal Button */}
        <button
          onClick={handleOpen}
          className={`absolute top-1/2 left-1/2 z-40 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOpening ? "seal-break" : ""
          }`}
          style={{
            width: "min(180px, 30vw)",
            height: "min(180px, 30vw)",
            transform: "translate(-50%, -50%)",
          }}
          aria-label="Abrir invitación"
        >
          <img
            src="/images/sello-nuestra-boda.png"
            alt="Sello de boda"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </button>
      </div>

      {/* Tap hint text */}
      <p
        className={`absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 text-text-dark/60 font-serif text-xs md:text-sm tracking-[0.2em] uppercase z-40 transition-opacity duration-500 ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
      >
        Toca para abrir
      </p>

      {/* Opening Animation Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isOpening ? "opacity-100 delay-1000" : "opacity-0 pointer-events-none"
        }`}
        style={{
          zIndex: 45,
          ...textureStyle,
        }}
      />

      <style>{`
        .envelope-flap-open {
          transform: rotateX(-180deg);
        }

        .seal-break {
          transform: translate(-50%, -50%);
          animation: sealBreak 0.6s ease-out forwards;
        }

        @keyframes sealBreak {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
