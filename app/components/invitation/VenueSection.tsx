import { Button } from "~/components/ui/Button";

export function VenueSection() {
  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-12 md:px-12 lg:px-24 md:py-16">
        {/* Text content */}
        <div className="text-center flex-1 md:max-w-xl px-6 py-16 md:p-0">
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
            src="/images/venue-asset.png"
            alt=""
            className="mx-auto my-6 h-16 w-auto opacity-50"
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
        <div className="flex-1 md:max-w-lg">
          <img
            src="/images/venue.jpg"
            alt="Hacienda Santa Sofía"
            className="w-full h-auto md:shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
