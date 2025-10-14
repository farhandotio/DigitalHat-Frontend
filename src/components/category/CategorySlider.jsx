import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard from "./CategoryCard";
import Title from "../title/Title";

const categories = [
  { id: 1, name: "Router" },
  { id: 2, name: "TWS Earbuds" },
  { id: 3, name: "Bluetooth Devices" },
  { id: 4, name: "Speakers" },
  { id: 5, name: "Wearables" },
  { id: 6, name: "Headphones" },
  { id: 7, name: "Gaming Consoles" },
  { id: 8, name: "Tripods" },
  { id: 9, name: "Webcams" },
  { id: 10, name: "Power Banks" },
  { id: 11, name: "Chargers & Cables" },
  { id: 12, name: "Smart Home Devices" },
];

const mid = Math.ceil(categories.length / 2);
const topRow = categories.slice(0, mid);
const bottomRow = categories.slice(mid);

const CategorySlider = () => {
  return (
    <section className="space-y-6 relative px-5 md:px-10 lg:px-20 pt-15">
      {/* <Title title="Shop by Category" /> */}
      <Swiper
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={20}
        // navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {topRow.map((category) => (
          <SwiperSlide key={`top-${category.id}`}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <Title
        title="Shop by Category" center
      /> */}
      <Swiper
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={20}
        // navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {bottomRow.map((category) => (
          <SwiperSlide key={`bottom-${category.id}`}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategorySlider;
