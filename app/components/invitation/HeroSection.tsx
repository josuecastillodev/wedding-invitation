import { CountdownTimer } from "./CountdownTimer";

export function HeroSection() {
  return (
    <section className="hero-background relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 bg-bg-light bg-position-[calc(50%+28vw)] bg-auto md:bg-center bg-no-repeat">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-bg-light/30" />

      {/* Main content - centered */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        <p className="font-script text-burgundy text-5xl md:text-6xl mb-4 animate-fade-in-up">
          Nuestra Boda
        </p>

        <h1 className="font-serif text-text-dark">
          <span className="block text-4xl md:text-4xl tracking-[0.3em] uppercase animate-fade-in-up delay-100">
            Yareli
          </span>
          <span className="block font-script text-burgundy text-5xl md:text-7xl my-2 animate-scale-in delay-200">
            &
          </span>
          <span className="block text-4xl md:text-4xl tracking-[0.3em] uppercase animate-fade-in-up delay-300">
            Luis
          </span>
        </h1>

        <p className="text-burgundy tracking-[0.10em] uppercase text-md md:text-lg mt-6 animate-fade-in delay-400">
          10 de abril de 2026
        </p>
      </div>

      {/* Countdown - fixed at bottom */}
      <div className="relative z-10 mb-12 animate-fade-in-up delay-500">
        <CountdownTimer />
      </div>
    </section>
  );
}
