import React, { useState, useEffect, useRef } from "react";
// Assuming assets contains bannar3, bannar4, etc.
import { assets } from "../../../public/assets/assets";

const Hero = () => {
  const sliderMedia = [
    assets.bannar3,
    assets.bannar4,
    // add more banner images here (images only)
  ];

  const AUTOPLAY_MS = 4000;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const normalizedIndex = (i) => {
    const len = sliderMedia.length;
    return ((i % len) + len) % len;
  };

  const goTo = (i) => setIndex(normalizedIndex(i));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay
  useEffect(() => {
    if (isPaused || sliderMedia.length <= 1) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => normalizedIndex(prev + 1));
    }, AUTOPLAY_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused, sliderMedia.length]);

  // Pause on hover / focus for accessibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => setIsPaused(true);
    const onLeave = () => setIsPaused(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focusin", onEnter);
    el.addEventListener("focusout", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("focusin", onEnter);
      el.removeEventListener("focusout", onLeave);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, sliderMedia.length]);

  // slide width percent (each slide equals wrapper width)
  const slideWidthPercent = `${100 / sliderMedia.length}%`;

  return (
    <section className="mx-auto px-5 md:px-10 lg:px-20 py-10">
      {/* Outer div to apply max height and control overall layout */}
      <div className="flex flex-col-reverse lg:flex-row rounded-xl shadow-2xl overflow-hidden  min-h-[500px]">
        {/* --- Left Content Area (Orange/Brown Background) --- */}
        <div className="flex-1 p-5 md:p-10 lg:p-10 bg-primary text-white flex flex-col justify-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none mb-2">
            Mega Sale Up To <span className="text-yellow-300">70%</span>
          </h1>
          <p className="text-3xl md:text-4xl lg:text-6xl font-black mb-6">OFF</p>

          {/* Description */}
          <p className="text-lg md:text-xl max-w-md mb-8 text-white/90">
            Discover amazing deals on electronics, fashion, home & garden, and
            more!
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Shop Now
            </button>
            <button className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition duration-300 border-2 border-primary">
              View Deals
            </button>
          </div>

          {/* Stats/Metrics */}
          <div className="flex space-x-8 mt-4 pt-4 border-t border-primary">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">50K+</span>
              <span className="text-sm text-white/90">Happy Customers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">10K+</span>
              <span className="text-sm text-white/90">Products</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">99%</span>
              <span className="text-sm text-white/90">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* --- Right Image Slider Area (Aspect Video Banner) --- */}
        <div
          ref={containerRef}
          className="relative flex-1 bg-gray-900 text-white flex justify-center items-center"
        >
          {/* TOP / BOTTOM TEXT ON THE RIGHT BLACK AREA (styled as requested) */}
          {/* Top text (small, faded, decorative) */}
          <div className="max-md:hidden absolute top-4 left-6 z-40 pointer-events-none">
            <span className="text-sm uppercase tracking-widest text-white/60 bg-text/30 px-3 py-1 rounded">
              Flash
            </span>
          </div>

          {/* Bottom text (prominent, callout) */}
          <div className="max-md:hidden absolute bottom-6 left-6 z-40 pointer-events-none">
            <span className="text-lg md:text-xl font-bold text-white bg-text/50 px-3 py-2 rounded">
              NEW ARRIVALS EVERY WEEK
            </span>
          </div>

          {/* Banner wrapper: Forces aspect-video ratio on the banner content */}
          <div className="w-full max-w-full aspect-video relative overflow-hidden">
            {/* Slides wrapper (Horizontal sliding container) */}
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                width: `${sliderMedia.length * 100}%`,
                transform: `translateX(-${
                  index * (100 / sliderMedia.length)
                }%)`,
              }}
            >
              {sliderMedia.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full relative"
                  style={{ width: slideWidthPercent }}
                >
                  <img
                    src={src}
                    alt={`Banner ${i + 1}`}
                    className="w-full h-full object-cover block"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <button
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full pointer-events-auto transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 15.293a1 1 0 010 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L8.414 10l5.293 5.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              aria-label="Next slide"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full pointer-events-auto transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 4.707a1 1 0 010-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L11.586 10 6.293 4.707a1 1 0 011.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex gap-2 pointer-events-auto">
              {sliderMedia.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      active ? "scale-125 bg-white" : "bg-white/40 hover:bg-white/80"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
