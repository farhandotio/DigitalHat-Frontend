import React from "react";
// Assuming assets contains user profile images
// import { assets } from "../../../public/assets/assets";

// Dummy data for users and reviews
const testimonialsData = [
  {
    name: "John Carter",
    review:
      "The experience was absolutely amazing! The process was smooth and I loved the quality of service provided.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1", // Placeholder avatar
  },
  {
    name: "Sophie Williams",
    review:
      "Great support team and incredibly fast delivery. I highly recommend them for any web development project.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=2", // Placeholder avatar
  },
  {
    name: "Michael Lee",
    review:
      "Exceptional and creative approach! My website looks absolutely fantastic now, and the service was truly superb.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=3", // Placeholder avatar
  },
];

const StarRating = ({ rating, className }) => {
  const maxRating = 5;
  const fullStars = Math.floor(rating);
  const emptyStars = maxRating - fullStars;

  return (
    <div className={`flex text-secondary`}>
           {" "}
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 fill-current ${className}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
                   {" "}
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 {" "}
        </svg>
      ))}
           {" "}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 fill-current text-gray-300 ${className}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
                   {" "}
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 {" "}
        </svg>
      ))}
         {" "}
    </div>
  );
};

const TestimonialCard = ({ data }) => {
  return (
    // Outer container for padding and bottom yellow bar
    <div className="max-w-md mx-auto rounded-t-4xl border-2 bg-white border-border overflow-hidden">
            {/* Top content area (White) */}     {" "}
      <div className="px-4 pt-4 flex flex-col items-center text-center">
               {" "}
        <img
          src={data.avatar}
          alt={data.name}
          className="w-12 h-12 rounded-full mb-3"
        />
               {" "}
        <h4 className="font-semibold text-gray-800 text-sm mb-1">
          {data.name}
        </h4>
               {" "}
        <p className="text-gray-600 text-xs italic">{data.review}</p>     {" "}
      </div>
            {/* Bottom Rating/Bar (Yellow) */}     {" "}
      <div className="flex justify-center pb-2">
                <StarRating rating={data.rating} className="w-4 h-4" />     {" "}
      </div>
         {" "}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="mx-auto px-5 md:px-30 lg:px-40 mt-10">
           {" "}
      <div className="mx-auto px-5 pt-5 md:pt-10 md:px-10 lg:px-10 bg-secondary-bg rounded-t-4xl shadow-lg">
                {/* Header Section */}       {" "}
        <div className="mb-8 md:text-center">
                   {" "}
          <h2 className="text-2xl md:text-3xl text-center font-bold text-gray-800 mb-1">
                        Trusted by 10,000+ Happy Customers!          {" "}
          </h2>
                    {/* Overall Rating */}         {" "}
          <div className="flex items-center md:justify-center w-full">
                       {" "}
            {/* Overall Star Rating: Adjusted size to look better */}           {" "}
            <div className="flex">
                           {" "}
              <StarRating rating={5} className="md:w-10 md:h-10 w-7 h-7" />       
                 {" "}
            </div>
                       {" "}
            <span className="ml-0 md:ml-3 text-lg font-bold text-gray-800 mt-2 md:mt-0">
                            4.9/5.0            {" "}
            </span>
          </div>
                 {" "}
        </div>
               {" "}
        {/* Testimonial Cards Grid: Ensure columns stack on mobile (default Tailwind behavior) */}
               {" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((review, index) => (
            <TestimonialCard key={index} data={review} />
          ))}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default Testimonials;
