import { SectionWrapper } from "~/components/ui/SectionWrapper";

interface ItineraryItemProps {
  icon: string;
  time: string;
  title: string;
  location: string;
  mapUrl?: string;
}

function ItineraryItem({
  icon,
  time,
  title,
  location,
  mapUrl,
}: ItineraryItemProps) {
  return (
    <div className="flex flex-col">
      {/* Icon + Line */}
      <div className="flex items-center gap-4 mb-4">
        <img src={icon} alt="" className="w-10 h-10 object-contain" />
        <div className="flex-1 h-px bg-text-dark/30" />
      </div>

      {/* Content */}
      <div className="pl-16">
        <p className="text-sm md:text-base text-text-dark/80 mb-1">{time}</p>
        <h3 className="font-serif text-base md:text-lg uppercase text-text-dark mb-1">
          {title}
        </h3>
        <p className="text-sm text-text-dark/70 mb-3">{location}</p>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-1.5 border border-burgundy text-burgundy text-xs uppercase tracking-wider hover:bg-burgundy hover:text-white transition-colors"
          >
            Ver Mapa
          </a>
        )}
      </div>
    </div>
  );
}

export function Itinerary() {
  const itineraryItems: ItineraryItemProps[] = [
    {
      icon: "/images/itinerary-01.svg",
      time: "5:00 PM",
      title: "Ceremonia Religiosa",
      location: "Templo de Nuestra Señora del Rosario",
      mapUrl: "#",
    },
    {
      icon: "/images/itinerary-02.svg",
      time: "7:00 PM",
      title: "Cóctel",
      location: "Lobby del hotel",
      mapUrl: "#",
    },
    {
      icon: "/images/itinerary-03.svg",
      time: "8:00 PM",
      title: "Recepción y Cena",
      location: "Salón III",
      mapUrl: "#",
    },
    {
      icon: "/images/itinerary-04.svg",
      time: "1:00 AM",
      title: "Tornaboda",
      location: "Las Velas Bar",
      mapUrl: "#",
    },
  ];

  return (
    <SectionWrapper className="text-center">
      {/* Decorative Flower */}
      <div className="flex justify-center mb-6">
        <img
          src="/images/itinerary.svg"
          alt=""
          className="w-12 h-14 md:w-14 md:h-16 object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.3em] text-text-dark mb-12 md:mb-16">
        Itinerario
      </h2>

      {/* Grid Layout */}
      <div className="max-w-4xl mx-auto md:px-4 px-10">
        {/* Mobile: Single column | Desktop: 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12 text-left">
          {itineraryItems.map((item, index) => (
            <ItineraryItem key={index} {...item} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
