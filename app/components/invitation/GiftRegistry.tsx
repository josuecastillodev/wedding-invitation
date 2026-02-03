import { SectionWrapper } from "~/components/ui/SectionWrapper";

export function GiftRegistry() {
  return (
    <SectionWrapper className="text-center">
      <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-widest text-text-dark">
        Mesa de Regalos
      </h2>
      <p className="font-script text-burgundy text-5xl mt-6 mb-8">Liverpool</p>
      <a
        href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51590751"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-burgundy text-white px-6 py-2 inline-block cursor-pointer"
      >
        <p className="text-lg tracking-[0.3em] mb-1 opacity-80">No. 51590751</p>
      </a>
    </SectionWrapper>
  );
}
