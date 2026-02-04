import { SectionWrapper } from "~/components/ui/SectionWrapper";
import { useInView } from "~/hooks/useInView";
import { asset } from "~/utils/assets";

interface ItineraryItemProps {
  icon: string;
  time: string;
  title: string;
  location: string;
  mapUrl?: string;
  isInView?: boolean;
  index?: number;
}

function ItineraryItem({
  icon,
  time,
  title,
  location,
  mapUrl,
  isInView = true,
  index = 0,
}: ItineraryItemProps) {
  return (
    <div
      className={`flex flex-col transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: isInView ? `${index * 150}ms` : "0ms" }}
    >
      {/* Icon + Line */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={icon}
          alt=""
          loading="lazy"
          className={`w-10 h-10 object-contain transition-transform duration-500 ${
            isInView ? "scale-100 rotate-0" : "scale-75 -rotate-12"
          }`}
          style={{ transitionDelay: isInView ? `${index * 150 + 100}ms` : "0ms" }}
        />
        <div
          className={`flex-1 h-px bg-text-dark/30 origin-left transition-transform duration-700 ${
            isInView ? "scale-x-100" : "scale-x-0"
          }`}
          style={{ transitionDelay: isInView ? `${index * 150 + 200}ms` : "0ms" }}
        />
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
            className="inline-block px-4 py-1.5 border border-burgundy text-burgundy text-xs uppercase tracking-wider hover:bg-burgundy hover:text-white transition-colors duration-300"
          >
            Ver Mapa
          </a>
        )}
      </div>
    </div>
  );
}

export function Itinerary() {
  const { ref: headerRef, isInView: headerInView } = useInView({ threshold: 0.3 });
  const { ref: gridRef, isInView: gridInView } = useInView({ threshold: 0.1 });

  const itineraryItems: Omit<ItineraryItemProps, "isInView" | "index">[] = [
    {
      icon: asset("/images/itinerary-01.svg"),
      time: "5:00 PM",
      title: "Ceremonia Religiosa",
      location: "Templo de Nuestra Señora del Rosario",
      mapUrl: "#",
    },
    {
      icon: asset("/images/itinerary-02.svg"),
      time: "7:00 PM",
      title: "Cóctel",
      location: "Lobby del hotel",
      mapUrl: "#",
    },
    {
      icon: asset("/images/itinerary-03.svg"),
      time: "8:00 PM",
      title: "Recepción y Cena",
      location: "Salón III",
      mapUrl: "#",
    },
    {
      icon: asset("/images/itinerary-04.svg"),
      time: "1:00 AM",
      title: "Tornaboda",
      location: "Las Velas Bar",
      mapUrl: "#",
    },
  ];

  return (
    <SectionWrapper className="text-center">
      {/* Header section */}
      <div ref={headerRef}>
        {/* Decorative Flower */}
        <div
          className={`flex justify-center mb-6 transition-all duration-700 ${
            headerInView ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <img
            src={asset("/images/itinerary.svg")}
            alt=""
            loading="lazy"
            className="w-12 h-14 md:w-14 md:h-16 object-contain"
          />
        </div>

        {/* Title */}
        <h2
          className={`font-serif text-2xl md:text-3xl uppercase tracking-[0.3em] text-text-dark mb-12 md:mb-16 transition-all duration-700 delay-100 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Itinerario
        </h2>
      </div>

      {/* Grid Layout */}
      <div ref={gridRef} className="max-w-4xl mx-auto md:px-4 px-10">
        {/* Mobile: Single column | Desktop: 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12 text-left">
          {itineraryItems.map((item, index) => (
            <ItineraryItem
              key={index}
              {...item}
              isInView={gridInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
