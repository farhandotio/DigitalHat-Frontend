import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard, { categoryItems } from "./CategoryCard";
import Title from "../title/Title";

const CategorySlider = () => {
  const mid = Math.ceil(categoryItems.length / 2);
  const topRow = categoryItems.slice(0, mid);
  const bottomRow = categoryItems.slice(mid);

  return (
    <section className="space-y-6 bg-gray-50 relative px-5 md:px-10 lg:px-20 py-10">
      {/* <Title title={"Shop By Category"} /> */}

      {/* Top row */}
      <Swiper
        modules={[Navigation, Keyboard, Autoplay]}
        keyboard={{ enabled: true }}
        slidesPerView={4}
        spaceBetween={15}
        loop={true} // ✅ Infinite loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        aria-label="Top category row"
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 2 },
          640: { slidesPerView: 6, spaceBetween: 5 },
          768: { slidesPerView: 8, spaceBetween: 7 },
          1024: { slidesPerView: 10, spaceBetween: 10 },
        }}
        className="category-swiper-top"
      >
        {topRow.map((category, i) => (
          <SwiperSlide key={`top-${i}`} className="!w-auto">
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom row */}
      <Swiper
        modules={[Navigation, Keyboard, Autoplay]}
        keyboard={{ enabled: true }}
        slidesPerView={4}
        spaceBetween={15}
        loop={true} // ✅ Infinite loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: true, // ✅ Opposite direction for nice motion contrast
        }}
        aria-label="Bottom category row"
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 2 },
          640: { slidesPerView: 6, spaceBetween: 5 },
          768: { slidesPerView: 8, spaceBetween: 7 },
          1024: { slidesPerView: 10, spaceBetween: 10 },
        }}
        className="category-swiper-bottom"
      >
        {bottomRow.map((category, i) => (
          <SwiperSlide key={`bottom-${i}`} className="!w-auto">
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategorySlider;
