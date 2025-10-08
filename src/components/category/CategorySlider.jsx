import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard from "./CategoryCard";
import Title from "../title/Title";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Books" },
  { id: 4, name: "Toys" },
  { id: 5, name: "Shoes" },
  { id: 6, name: "Gadgets" },
  { id: 7, name: "Furniture" },
  { id: 8, name: "Beauty" },
  { id: 9, name: "Sports" },
  { id: 10, name: "Groceries" },
  { id: 11, name: "Jewelry" },
  { id: 12, name: "Accessories" },
];

const mid = Math.ceil(categories.length / 2);
const topRow = categories.slice(0, mid);
const bottomRow = categories.slice(mid);

const CategorySlider = () => {
  return (
    <section className="space-y-6 relative px-5 md:px-10 lg:px-20">
      <Title
        title="Shop by Category"
        description="Discover all our product categories and find what you are looking for quickly."
        center
      />
      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={20}
        // navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {topRow.map((category) => (
          <SwiperSlide key={`top-${category.id}`}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={20}
        // navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
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
