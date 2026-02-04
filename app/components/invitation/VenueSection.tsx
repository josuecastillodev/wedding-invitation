import { Button } from "~/components/ui/Button";
import { useInView } from "~/hooks/useInView";
import { asset } from "~/utils/assets";

export function VenueSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-12 md:px-12 lg:px-24 md:py-16">
        {/* Text content */}
        <div
          className={`text-center flex-1 md:max-w-xl px-6 py-16 md:p-0 transition-all duration-700 ${
            isInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 md:-translate-x-8"
          }`}
        >
          <p className="font-script text-burgundy text-5xl mb-3">
            Nos casamos en
          </p>
          <h2 className="font-serif text-2xl uppercase tracking-widest md:tracking-[0.2em] text-text-dark">
            Hacienda Santa Sofía
          </h2>
          <p className="text-burgundy tracking-[0.15em] mt-4 text-2xl">
            10. 04. 2026
          </p>

          <img
            src={asset("/images/venue-asset.png")}
            alt=""
            loading="lazy"
            className={`mx-auto my-6 h-16 w-auto opacity-50 transition-all duration-500 delay-200 ${
              isInView ? "scale-100" : "scale-90"
            }`}
          />

          <Button
            variant="filled"
            href="https://maps.app.goo.gl/BYRBWi9MgLoKGs6j7?g_st=ic"
            className="w-full max-w-64 mx-auto capitalize! text-xl"
          >
            Ver mapa
          </Button>
        </div>

        {/* Venue photo */}
        <div
          className={`flex-1 md:max-w-lg transition-all duration-700 delay-200 ${
            isInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 md:translate-x-8"
          }`}
        >
          <img
            src={asset("/images/venue.jpg")}
            alt="Hacienda Santa Sofía"
            loading="lazy"
            className="w-full h-auto md:shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
