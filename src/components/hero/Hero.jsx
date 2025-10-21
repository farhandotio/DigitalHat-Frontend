import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../../public/assets/assets";

const Hero = () => {
  const sliderMedia = [
    { webp: assets.bannar3Webp, fallback: assets.bannar3 },
    { webp: assets.bannar4Webp, fallback: assets.bannar4 },
  ];

  const AUTOPLAY_MS = 4000;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  const normalizedIndex = (i) => ((i % sliderMedia.length) + sliderMedia.length) % sliderMedia.length;
  const goTo = (i) => setIndex(normalizedIndex(i));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay
  useEffect(() => {
    if (isPaused || sliderMedia.length <= 1) return;
    const id = setTimeout(() => setIndex((prev) => normalizedIndex(prev + 1)), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, isPaused]);

  // Pause on hover/focus
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
  }, [index]);

  const slideWidthPercent = `${100 / sliderMedia.length}%`;

  return (
    <section className="mx-auto px-5 md:px-10 lg:px-20 pt-5 pb-10 md:pt-30 md:pb-20 min-h-[600px] ">
      <div className="flex flex-col-reverse lg:flex-row">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center rounded-2xl mt-10 leading-relaxed">
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-primary md:-mt-10">
            Shop Everything <br /> You Love at <br />{" "}
            <span className="text-gray-800">DigitalHat</span>
          </h1>
          <div className="flex">
            <Link
              to="/shop"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:scale-103 transition duration-300 text-lg"
              aria-label="Shop Everything at DigitalHat"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right Slider */}
        <div
          ref={containerRef}
          className="relative flex-1 flex justify-center items-center rounded-xl"
        >
          <div className="w-full h-full relative overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
              style={{
                width: `${sliderMedia.length * 100}%`,
                transform: `translateX(-${index * (100 / sliderMedia.length)}%)`,
              }}
            >
              {sliderMedia.map((slide, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full relative flex items-center justify-center"
                  style={{ width: slideWidthPercent }}
                >
                  <picture>
                    <source srcSet={slide.webp} type="image/webp" />
                    <img
                      src={slide.fallback}
                      alt={`DigitalHat Hero Banner ${i + 1} showcasing latest gadgets`}
                      className="w-full aspect-video rounded-2xl object-cover block"
                      width={1200}
                      height={675}
                      loading={i === index ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </picture>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-10 md:bottom-7 right-5 z-40 flex gap-2">
              {sliderMedia.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      active
                        ? "scale-125 bg-orange-500"
                        : "bg-gray-400 hover:bg-secondary-bg"
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
