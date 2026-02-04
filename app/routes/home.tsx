import type { Route } from "./+types/home";
import { useSearchParams } from "react-router";
import { HeroSection } from "~/components/invitation/HeroSection";
import { PhotoGallery } from "~/components/invitation/PhotoGallery";
import { VenueSection } from "~/components/invitation/VenueSection";
import { GiftRegistry } from "~/components/invitation/GiftRegistry";
import { AdultsOnlySection } from "~/components/invitation/AdultsOnlySection";
import { DressCode } from "~/components/invitation/DressCode";
import { Itinerary } from "~/components/invitation/Itinerary";
import { Hospedaje } from "~/components/invitation/Hospedaje";
import { Footer } from "~/components/invitation/Footer";
import { EnvelopeOpening } from "~/components/invitation/EnvelopeOpening";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Yareli & Luis · 10 de Abril 2026" },
    {
      name: "description",
      content: "Invitación de boda de Yareli y Luis - 10 de Abril de 2026",
    },
    { property: "og:title", content: "Yareli & Luis · Nuestra Boda" },
    {
      property: "og:description",
      content: "Te invitamos a celebrar nuestra boda - 10 de Abril de 2026",
    },
  ];
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const nombre = searchParams.get("Nombre") || "";
  const pases = searchParams.get("Pases") || "";

  return (
    <EnvelopeOpening>
      <main>
        <HeroSection />
        <PhotoGallery />
        <VenueSection />
        <GiftRegistry />
        <AdultsOnlySection nombre={nombre} pases={pases} />
        {/* <DressCode /> */}
        {/* <Itinerary /> */}
        {/* <Hospedaje /> */}
        <Footer />
      </main>
    </EnvelopeOpening>
  );
}
