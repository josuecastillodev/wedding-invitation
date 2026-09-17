import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

const BASE_TALLY_URL = `https://tally.so/r/${EVENT_CONFIG.tallyFormId}`;

interface RsvpButtonProps {
  label: string;
  variant?: "solid" | "outline";
}

/** Propaga Nombre y Pases desde la URL de la invitación al formulario de Tally */
function buildTallyUrl(search: string): string {
  const params = new URLSearchParams(search);
  const tallyParams = new URLSearchParams();

  const nombre = params.get("Nombre");
  const pases = params.get("Pases");
  if (nombre) tallyParams.set("Nombre", nombre);
  if (pases) tallyParams.set("Pases", pases);

  const queryString = tallyParams.toString();
  return queryString ? `${BASE_TALLY_URL}?${queryString}` : BASE_TALLY_URL;
}

export function RsvpButton({ label, variant = "solid" }: RsvpButtonProps) {
  // Arranca sin parámetros para evitar desajuste de hidratación
  const [tallyUrl, setTallyUrl] = useState(BASE_TALLY_URL);

  useEffect(() => {
    setTallyUrl(buildTallyUrl(window.location.search));
  }, []);

  const styles =
    variant === "solid"
      ? "bg-accent text-white hover:bg-accent-soft"
      : "border border-accent text-accent hover:bg-accent hover:text-white";

  return (
    <a
      href={tallyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-10 py-2 font-serif font-bold text-2xl md:text-3xl text-center transition-colors duration-300 max-w-64 rounded-md ${styles}`}
    >
      {label}
    </a>
  );
}

export default RsvpButton;
