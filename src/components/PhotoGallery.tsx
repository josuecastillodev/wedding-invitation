import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

const baseUrl = EVENT_CONFIG.baseUrl;

// Lista de imágenes
const images = [
  { src: `${baseUrl}/images/novios01.webp`, alt: "Yareli y Luis" },
  { src: `${baseUrl}/images/novios02.webp`, alt: "Yareli y Luis en el auto" },
  { src: `${baseUrl}/images/novios03.webp`, alt: "Auto en la carretera" },
  { src: `${baseUrl}/images/novios04.webp`, alt: "Yareli y Luis con el auto" },
  { src: `${baseUrl}/images/novios05.webp`, alt: "Yareli y Luis" },
];

// Duplicar imágenes para efecto infinito
const duplicatedImages = [...images, ...images];

export function PhotoGallery() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mobilePositionRef = useRef(0);
  const desktopPositionRef = useRef(0);

  // IntersectionObserver para detectar cuando está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación de carrusel
  useEffect(() => {
    if (!isInView) return;

    const speed = 1.5;

    const animate = () => {
      // Mobile
      if (mobileContainerRef.current) {
        const totalWidth = mobileContainerRef.current.scrollWidth;
        const resetPoint = totalWidth / 2;

        if (resetPoint > 0) {
          mobilePositionRef.current += speed;
          if (mobilePositionRef.current >= resetPoint) {
            mobilePositionRef.current -= resetPoint;
          }
          mobileContainerRef.current.style.transform = `translateX(-${mobilePositionRef.current}px)`;
        }
      }

      // Desktop
      if (desktopContainerRef.current) {
        const totalWidth = desktopContainerRef.current.scrollWidth;
        const resetPoint = totalWidth / 2;

        if (resetPoint > 0) {
          desktopPositionRef.current += speed;
          if (desktopPositionRef.current >= resetPoint) {
            desktopPositionRef.current -= resetPoint;
          }
          desktopContainerRef.current.style.transform = `translateX(-${desktopPositionRef.current}px)`;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden relative">
      {/* Mobile: Carrusel con imágenes de altura fija */}
      <div className="md:hidden relative h-[100vw] overflow-hidden">
        <div
          ref={mobileContainerRef}
          className={`flex h-full transition-opacity duration-700 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
        >
          {duplicatedImages.map((img, index) => (
            <img
              key={`mobile-${img.src}-${index}`}
              src={img.src}
              alt={img.alt}
              loading={index < images.length ? "eager" : "lazy"}
              className={`h-full w-auto object-cover shrink-0 transition-all duration-700 ${
                isInView ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Carrusel con imágenes de altura fija */}
      <div className="hidden md:block h-[25vw] overflow-hidden">
        <div
          ref={desktopContainerRef}
          className={`flex h-full transition-opacity duration-700 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
        >
          {duplicatedImages.map((img, index) => (
            <img
              key={`desktop-${img.src}-${index}`}
              src={img.src}
              alt={img.alt}
              loading={index < images.length ? "eager" : "lazy"}
              className={`h-full w-auto object-cover shrink-0 transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isInView ? `${(index % 4) * 100}ms` : "0ms",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhotoGallery;
