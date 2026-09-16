import { useEffect, useState } from "react";
import type { Lang } from "../i18n/translations";

interface NavMenuLabels {
  home: string;
  rsvp: string;
  gift: string;
  hospedaje: string;
}

interface NavMenuProps {
  lang: Lang;
  homeHref: string;
  rsvpHref: string;
  giftHref: string;
  hospedajeHref: string;
  labels: NavMenuLabels;
}

export function NavMenu({
  lang,
  homeHref,
  rsvpHref,
  giftHref,
  hospedajeHref,
  labels,
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openAriaLabel = lang === "en" ? "Open menu" : "Abrir menú";
  const closeAriaLabel = lang === "en" ? "Close menu" : "Cerrar menú";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const links = [
    { href: homeHref, label: labels.home },
    { href: rsvpHref, label: labels.rsvp },
    { href: giftHref, label: labels.gift },
    { href: hospedajeHref, label: labels.hospedaje },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={openAriaLabel}
        aria-expanded={isOpen}
        className="fixed top-4 left-4 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 border border-accent/30 shadow-md backdrop-blur-sm"
      >
        <span className="flex flex-col gap-[3px]" aria-hidden="true">
          <span className="block h-[2px] w-4 bg-ink" />
          <span className="block h-[2px] w-4 bg-ink" />
          <span className="block h-[2px] w-4 bg-ink" />
        </span>
      </button>

      <div
        className="fixed inset-0 z-[70]"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <button
          type="button"
          aria-label={closeAriaLabel}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-ink/40"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
        />

        <nav
          aria-hidden={!isOpen}
          className="absolute left-0 top-0 h-full w-[280px] max-w-[80%] bg-paper shadow-xl px-8 py-16 flex flex-col gap-8"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 300ms ease-out",
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={closeAriaLabel}
            className="self-end font-serif text-2xl leading-none text-ink"
          >
            ×
          </button>

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-xl text-ink hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

export default NavMenu;
