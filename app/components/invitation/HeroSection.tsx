import { FloralDivider } from "~/components/ui/FloralDivider";
import { CountdownTimer } from "./CountdownTimer";

export function HeroSection() {
  return (
    <section className="hero-background relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 bg-bg-light bg-position-[calc(50%+28vw)] bg-auto md:bg-center bg-no-repeat">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-bg-light/30" />

      {/* Main content - centered */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        {/* <FloralDivider variant="flor-1" className="mb-8 opacity-60" /> */}

        <p className="font-script text-burgundy text-5xl md:text-6xl mb-4">
          Nuestra Boda
        </p>

        <h1 className="font-serif text-text-dark">
          <span className="block text-4xl md:text-4xl tracking-[0.3em] uppercase">
            Yareli
          </span>
          <span className="block font-script text-burgundy text-5xl md:text-7xl my-2">
            &
          </span>
          <span className="block text-4xl md:text-4xl tracking-[0.3em] uppercase">
            Luis
          </span>
        </h1>

        <p className="text-burgundy tracking-[0.10em] uppercase text-md md:text-lg mt-6">
          10 de abril de 2026
        </p>

        {/* <FloralDivider variant="flor-2" className="my-12 opacity-60" /> */}
      </div>

      {/* Countdown - fixed at bottom */}
      <div className="relative z-10 mb-12">
        <CountdownTimer />
      </div>
    </section>
  );
}
