import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "@/mocks/store";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const next = () => setIndex((current) => (current + 1) % heroSlides.length);
  const prev = () => setIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <div className="relative mx-0 overflow-hidden rounded-xl shadow-sm sm:rounded-2xl lg:rounded-3xl">
          <div className="flex h-[320px] transition-transform duration-700 ease-out sm:h-[420px] lg:h-[480px]" style={{ transform: `translateX(-${index * 100}%)` }}>
            {heroSlides.map((slide) => (
              <div key={slide.id} className="relative h-full w-full flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  title={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl px-6 sm:px-10 lg:px-14">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-background-50/15 px-3 py-1 text-xs font-medium text-background-50 backdrop-blur dark:text-background-950">
                      <i className="ri-shield-check-line" />
                      Kurumsal tedarik
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold leading-tight text-background-50 dark:text-background-950 sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-background-100 dark:text-background-800 sm:text-base">
                      {slide.subtitle}
                    </p>
                    <Link
                      to="/kategoriler"
                      className="mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-950 transition-transform hover:scale-105 dark:bg-background-950 dark:text-background-50"
                    >
                      {slide.cta}
                      <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Önceki slide"
            className="absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background-50/90 text-foreground-900 shadow-md transition-colors hover:bg-background-50 sm:left-6 sm:h-11 sm:w-11"
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Sonraki slide"
            className="absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background-50/90 text-foreground-900 shadow-md transition-colors hover:bg-background-50 sm:right-6 sm:h-11 sm:w-11"
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-6 sm:gap-2">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`${slide.title} slide'ına git`}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 sm:h-2 ${
                  slideIndex === index
                    ? "w-6 bg-background-50 dark:bg-background-950 sm:w-8"
                    : "w-1.5 bg-background-50/50 hover:bg-background-50/80 dark:bg-background-900 sm:w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}