export function PhotoGallery() {
  return (
    <section className="w-full overflow-hidden">
      {/* Mobile: Solo primera imagen */}
      <div className="md:hidden">
        <img
          src="/images/novios01.jpg"
          alt="Yareli y Luis"
          className="w-full h-[125vw] object-cover"
        />
      </div>

      {/* Desktop: 4 imágenes en fila */}
      <div className="hidden md:flex h-[25vw]">
        <img
          src="/images/novios01.jpg"
          alt="Yareli y Luis"
          className="h-full w-auto object-cover"
        />
        <img
          src="/images/novios02.jpg"
          alt="Yareli y Luis en el auto"
          className="h-full w-auto object-cover"
        />
        <img
          src="/images/novios03.jpg"
          alt="Auto en la carretera"
          className="h-full flex-1 object-cover"
        />
        <img
          src="/images/novios04.jpg"
          alt="Yareli y Luis con el auto"
          className="h-full w-auto object-cover"
        />
      </div>
    </section>
  );
}
