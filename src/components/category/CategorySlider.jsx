import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard, { categoryItems } from "./CategoryCard";
import Title from "../title/Title";

const CategorySlider = () => {
  const mid = Math.ceil(categoryItems.length / 2);
  const topRow = categoryItems.slice(0, mid);
  const bottomRow = categoryItems.slice(mid);

  return (
    <section className="space-y-6 relative px-5 md:px-10 lg:px-20 py-10 bg-gray-100">
      <Title title={"Shop By Category"} />
      {/* Top row */}
      <Swiper
        modules={[Navigation, Keyboard]}
        // navigation={true}
        keyboard={{ enabled: true }}
        slidesPerView={2}
        spaceBetween={20}
        loop={false}
        aria-label="Top category row"
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 20 },
          640: { slidesPerView: 4, spaceBetween: 30 },
          768: { slidesPerView: 5, spaceBetween: 40 },
          1024: { slidesPerView: 6, spaceBetween: 50 },
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
        modules={[Navigation, Keyboard]}
        // navigation={true}
        keyboard={{ enabled: true }}
        slidesPerView={2}
        spaceBetween={20}
        loop={false}
        aria-label="Bottom category row"
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 20 },
          640: { slidesPerView: 4, spaceBetween: 30 },
          768: { slidesPerView: 5, spaceBetween: 40 },
          1024: { slidesPerView: 6, spaceBetween: 50 },
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
