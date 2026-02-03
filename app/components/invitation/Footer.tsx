export function Footer() {
  return (
    <footer className="relative">
      {/* Top Section - Textured Background (continues from previous sections) */}
      <div
        className="relative h-40 md:h-48"
        style={{
          backgroundImage: `
            url("/images/bg-fijo.jpg"),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            )
          `,
          backgroundAttachment: "fixed",
          backgroundSize: "cover, auto, auto",
          backgroundPosition: "center, 0 0, 0 0",
          backgroundRepeat: "no-repeat, repeat, repeat",
          backgroundColor: "#F5F5F5",
        }}
      />

      {/* Main Section - Burgundy Background */}
      <div className="bg-burgundy text-white text-center relative -mt-24 md:-mt-28">
        <div className="relative text-center px-6 pt-24 md:pt-28">
          {/* Photo - Positioned to overlap both sections */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg z-10">
            <img
              src="/images/miguel-angel-ramirez.png"
              alt="Miguel Angel Ramírez"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Greeting */}
          <p className="font-script text-3xl md:text-4xl mt-8">—Hola,</p>

          {/* Name */}
          <h3 className="font-serif text-sm md:text-base uppercase tracking-[0.2em] mt-4">
            Soy Miguel Angel Ramírez
          </h3>

          {/* Description */}
          <div className="max-w-2xl mx-auto mt-6 space-y-4 text-xs md:text-sm leading-relaxed text-center md:text-left">
            <p>
              Estoy aquí para acompañarte en cada paso hacia ese día tan
              especial. Si tienes dudas sobre el evento, paquetes o
              reservaciones, no dudes en escribirme. Será un placer ayudarte a
              que vivas esta experiencia de forma sencilla, clara y sin
              complicaciones.
            </p>
            <p>
              En Conceptos Finos, cada proyecto es una historia que merece ser
              contada de forma inolvidable. Me especializo en transformar tus
              ideas en una experiencia que trasciende el tiempo, asegurando que
              cada detalle refleje la singularidad de tu celebración.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto my-6">
          <img
            src="/images/logotipo.png"
            alt="Conceptos Finos"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Contact Info */}
        <p className="font-serif text-sm md:text-base uppercase tracking-[0.15em]">
          Miguel Angel Ramírez
        </p>
        <a
          href="mailto:gerencia@conceptosfinos.com.mx"
          className="block text-sm md:text-base mt-2 hover:underline"
        >
          gerencia@conceptosfinos.com.mx
        </a>
        <a
          href="tel:+523332233868"
          className="block text-sm md:text-base mt-1 hover:underline"
        >
          33 3223 3868
        </a>

        {/* Instagram */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-sm">Sigue nuestras bodas en Instagram</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
        </div>

        {/* Credits */}
        <p className="text-xs md:text-sm mt-1 opacity-80 pb-4">
          © Diseñado por Dizaru. 2025.
        </p>
      </div>
    </footer>
  );
}
