import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

const STORAGE_KEY = "bg-music-muted";
export const MUSIC_START_EVENT = "bg-music:start";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const baseUrl = EVENT_CONFIG.baseUrl;
  const src = `${baseUrl}${EVENT_CONFIG.music.src}`;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsMuted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = EVENT_CONFIG.music.volume;
    audio.loop = true;
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setIsVisible(true);
      const audio = audioRef.current;
      if (!audio) return;
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    window.addEventListener(MUSIC_START_EVENT, handleStart);
    return () => window.removeEventListener(MUSIC_START_EVENT, handleStart);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          localStorage.setItem(STORAGE_KEY, "false");
        })
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Silenciar música" : "Reproducir música"}
        className="fixed bottom-5 right-5 z-[60] flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[#842A29]/20 shadow-lg text-[#842A29] w-11 h-11 md:w-12 md:h-12 transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: isPlaying
              ? "0 0 0 0 rgba(132, 42, 41, 0.35)"
              : "none",
            animation: isPlaying ? "bg-music-pulse 2.2s ease-out infinite" : "none",
          }}
        />
        {isPlaying ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
      <style>{`
        @keyframes bg-music-pulse {
          0% { box-shadow: 0 0 0 0 rgba(132, 42, 41, 0.35); }
          70% { box-shadow: 0 0 0 14px rgba(132, 42, 41, 0); }
          100% { box-shadow: 0 0 0 0 rgba(132, 42, 41, 0); }
        }
      `}</style>
    </>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 md:w-6 md:h-6"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 md:w-6 md:h-6"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

export default BackgroundMusic;
