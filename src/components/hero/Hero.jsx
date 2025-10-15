import React, { useState, useEffect, useRef } from "react";
// Assuming assets contains banner3, banner4, etc.
import { assets } from "../../../public/assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  const sliderMedia = [
    assets.bannar3, // This would be the "Become a Seller" image from your example
    assets.bannar4, // This would be another banner image
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
  const prev = () => goTo(index - 1); // Autoplay

  useEffect(() => {
    if (isPaused || sliderMedia.length <= 1) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => normalizedIndex(prev + 1));
    }, AUTOPLAY_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused, sliderMedia.length]); // Pause on hover / focus for accessibility

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
  }, []); // Keyboard navigation

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, sliderMedia.length]); // slide width percent (each slide equals wrapper width)

  const slideWidthPercent = `${100 / sliderMedia.length}%`;

  return (
    <section className="mx-auto px-5 md:px-10 lg:px-20 py-5 md:py-10">
      {/* Outer div to apply max height and control overall layout */}{" "}
      <div className="flex flex-col-reverse lg:flex-row rounded-xl">
        {/* --- Left Content Area (Orange/Brown Background) --- */}{" "}
        <div className="flex-1 flex flex-col justify-center rounded-2xl">
          {/* Title */}         {" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-orange-500">
            Shop Everything <br /> You Love at <br />{" "}
            <span className="text-gray-800">DigitalHat</span>         {" "}
          </h1>
          {/* Buttons */}         {" "}
          <div className="flex">
            {" "}
            <Link
              to={"/shop"}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="pl-8 py-3 bg-primary text-white font-semibold rounded-full hover:scale-103 transition duration-300 text-lg"
            >
              Shop Now            {" "}
            </Link>{" "}
          </div>{" "}
        </div>
        {/* --- Right Image Slider Area --- */}       {" "}
        <div
          ref={containerRef}
          className="relative flex-1 flex justify-center items-center rounded-xl"
        >
          {" "}
          {/* Banner wrapper: forces content to fit within this area */}{" "}
          <div className="w-full h-full relative overflow-hidden rounded-2xl">
            {/* Slides wrapper (Horizontal sliding container) */}{" "}
            <div
              className="flex h-full transition-transform duration-700 ease-in-out  rounded-2xl"
              style={{
                width: `${sliderMedia.length * 100}%`,
                transform: `translateX(-${
                  index * (100 / sliderMedia.length)
                }%)`,
              }}
            >
              {" "}
              {sliderMedia.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full relative flex items-center justify-center  rounded-2xl" // Center content
                  style={{ width: slideWidthPercent }}
                >
                  {" "}
                  <img
                    src={src}
                    alt={`Banner ${i + 1}`}
                    className="w-full aspect-video object-cover block rounded-2xl" // Use object-contain to fit the image without cropping
                    draggable={false}
                  />{" "}
                </div>
              ))}{" "}
            </div>
            {/* Dots (styled to match example) */}           {" "}
            <div className="absolute bottom-7 right-5 z-40 flex gap-2">
              {" "}
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
              })}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};

export default Hero;
