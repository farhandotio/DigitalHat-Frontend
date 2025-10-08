import p_img1 from "./p_img1.png";
import p_img2_1 from "./p_img2_1.png";
import p_img2_2 from "./p_img2_2.png";
import p_img2_3 from "./p_img2_3.png";
import p_img2_4 from "./p_img2_4.png";
import p_img3 from "./p_img3.png";
import p_img4 from "./p_img4.png";
import p_img5 from "./p_img5.png";
import p_img6 from "./p_img6.png";
import p_img7 from "./p_img7.png";
import p_img8 from "./p_img8.png";
import p_img9 from "./p_img9.png";
import p_img10 from "./p_img10.png";
import p_img11 from "./p_img11.png";
import p_img12 from "./p_img12.png";
import p_img13 from "./p_img13.png";
import p_img14 from "./p_img14.png";
import p_img15 from "./p_img15.png";
import p_img16 from "./p_img16.png";
import p_img17 from "./p_img17.png";
import p_img18 from "./p_img18.png";
import p_img19 from "./p_img19.png";
import p_img20 from "./p_img20.png";
import p_img21 from "./p_img21.png";
import p_img22 from "./p_img22.png";
import p_img23 from "./p_img23.png";
import p_img24 from "./p_img24.png";
import p_img25 from "./p_img25.png";
import p_img26 from "./p_img26.png";
import p_img27 from "./p_img27.png";
import p_img28 from "./p_img28.png";
import p_img29 from "./p_img29.png";
import p_img30 from "./p_img30.png";
import p_img31 from "./p_img31.png";
import p_img32 from "./p_img32.png";
import p_img33 from "./p_img33.png";
import p_img34 from "./p_img34.png";
import p_img35 from "./p_img35.png";
import p_img36 from "./p_img36.png";
import p_img37 from "./p_img37.png";
import p_img38 from "./p_img38.png";
import p_img39 from "./p_img39.png";
import p_img40 from "./p_img40.png";
import p_img41 from "./p_img41.png";
import p_img42 from "./p_img42.png";
import p_img43 from "./p_img43.png";
import p_img44 from "./p_img44.png";
import p_img45 from "./p_img45.png";
import p_img46 from "./p_img46.png";
import p_img47 from "./p_img47.png";
import p_img48 from "./p_img48.png";
import p_img49 from "./p_img49.png";
import p_img50 from "./p_img50.png";
import p_img51 from "./p_img51.png";
import p_img52 from "./p_img52.png";
import bannar3 from "./bannar-3.png";
import bannar4 from "./bannar-4.png";

import logo from "./logo.png";
import hero_img from "./hero_img.jpg";
import cart_icon from "./cart_icon.png";
import bin_icon from "./bin_icon.png";
import dropdown_icon from "./dropdown_icon.png";
import exchange_icon from "./exchange_icon.png";
import profile_icon from "./profile_icon.png";
import quality_icon from "./quality_icon.png";
import search_icon from "./search_icon.png";
import star_dull_icon from "./star_dull_icon.png";
import star_icon from "./star_icon.png";
import support_img from "./support_img.png";
import menu_icon from "./menu_icon.png";
import about_img from "./about_img.png";
import contact_img from "./contact_img.png";
import razorpay_logo from "./razorpay_logo.png";
import stripe_logo from "./stripe_logo.png";
import cross_icon from "./cross_icon.png";

export const assets = {
  logo,
  hero_img,
  cart_icon,
  dropdown_icon,
  exchange_icon,
  profile_icon,
  quality_icon,
  search_icon,
  star_dull_icon,
  star_icon,
  bin_icon,
  support_img,
  menu_icon,
  about_img,
  contact_img,
  razorpay_logo,
  stripe_logo,
  cross_icon,
  bannar3,
  bannar4
};

export const products = [
  {
    title: "Apple iPhone 15 Pro Max",
    description:
      "Apple’s latest flagship smartphone with A17 Pro chip, 120Hz display, and titanium design.",
    price: { amount: 189999, currency: "BDT" },
    _id: "6710abc1234567890abc0001",
    images: [p_img1, p_img6, p_img3, p_img5, p_img7],
    category: "Smartphones",
    stock: 0,
    averageRating: 4.9,
    reviewCount: 342,
    offer: "20%",
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android smartphone with 200MP camera, S Pen, and 5000mAh battery.",
    price: { amount: 159999, currency: "BDT" },
    _id: "6710abc1234567890abc0002",
    images: [p_img2_1, p_img2_2, p_img2_3, p_img2_4],
    category: "Smartphones",
    stock: 50,
    averageRating: 4.8,
    reviewCount: 210,
    offer: "20%",
  },
  {
    title: "Asus ROG Strix G16 Gaming Laptop",
    description:
      "High-performance gaming laptop with RTX 4070 GPU, Intel i9 processor, and 165Hz QHD display.",
    price: { amount: 2450, currency: "USD" },
    _id: "6710abc1234567890abc0003",
    images: [p_img3],
    category: "Laptops",
    stock: 20,
    averageRating: 4.7,
    reviewCount: 119,
    offer: "20%",
  },
  {
    title: "HP Envy x360 Convertible Laptop",
    description:
      "2-in-1 touchscreen laptop with AMD Ryzen 7, 16GB RAM, and 512GB SSD.",
    price: { amount: 1220, currency: "USD" },
    _id: "6710abc1234567890abc0004",
    images: [p_img4],
    category: "Laptops",
    stock: 25,
    averageRating: 4.6,
    reviewCount: 84,
    offer: "0%",
  },
  {
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    description:
      "Industry-leading wireless headphones with adaptive sound and 30-hour battery life.",
    price: { amount: 489, currency: "USD" },
    _id: "6710abc1234567890abc0005",
    images: [p_img5],
    category: "Audio",
    stock: 60,
    averageRating: 4.9,
    reviewCount: 312,
    offer: "20%",
  },
  {
    title: "Logitech MX Master 3S Mouse",
    description:
      "Ergonomic wireless mouse with ultra-fast scrolling and multi-device support.",
    price: { amount: 10500, currency: "BDT" },
    _id: "6710abc1234567890abc0006",
    images: [p_img6],
    category: "Accessories",
    stock: 80,
    averageRating: 4.8,
    reviewCount: 95,
    offer: "50%",
  },
  {
    title: "Dell 27-inch 4K UHD Monitor",
    description:
      "Vibrant 4K display with HDR support and ultra-thin bezels for productivity and entertainment.",
    price: { amount: 75000, currency: "BDT" },
    _id: "6710abc1234567890abc0007",
    images: [p_img7],
    category: "Monitors",
    stock: 40,
    averageRating: 4.7,
    reviewCount: 143,
    offer: "20%",
  },
  {
    title: "Canon EOS R6 Mark II Camera",
    description:
      "Full-frame mirrorless camera with advanced autofocus and 4K video capabilities.",
    price: { amount: 1850, currency: "USD" },
    _id: "6710abc1234567890abc0008",
    images: [p_img8],
    category: "Cameras",
    stock: 15,
    averageRating: 4.9,
    reviewCount: 178,
    offer: "10%",
  },
  {
    title: "Nike Air Zoom Pegasus 40",
    description:
      "Lightweight running shoes designed for comfort and long-distance performance.",
    price: { amount: 13500, currency: "BDT" },
    _id: "6710abc1234567890abc0009",
    images: [p_img9],
    category: "Footwear",
    stock: 120,
    averageRating: 4.6,
    reviewCount: 210,
    offer: "20%",
  },
  {
    title: "Adidas Ultraboost 23",
    description:
      "Premium running shoe with boost cushioning and knit upper for maximum comfort.",
    price: { amount: 14999, currency: "INR" },
    _id: "6710abc1234567890abc0010",
    images: [p_img10],
    category: "Footwear",
    stock: 95,
    averageRating: 4.5,
    reviewCount: 180,
    offer: "22%",
  },
  {
    title: 'Samsung 55" Crystal UHD Smart TV',
    description:
      "4K smart TV with vivid color reproduction, HDR, and built-in streaming apps.",
    price: { amount: 85000, currency: "BDT" },
    _id: "6710abc1234567890abc0011",
    images: [p_img11],
    category: "Electronics",
    stock: 25,
    averageRating: 4.8,
    reviewCount: 166,
    offer: "20%",
  },
  {
    title: "Mi Smart Air Purifier 4 Pro",
    description:
      "High-efficiency air purifier with OLED display and smart home connectivity.",
    price: { amount: 25999, currency: "BDT" },
    _id: "6710abc1234567890abc0012",
    images: [p_img12],
    category: "Home Appliances",
    stock: 70,
    averageRating: 4.4,
    reviewCount: 74,
    offer: "20%",
  },
  {
    title: "KitchenAid Artisan Mixer",
    description:
      "Iconic kitchen stand mixer with 10 speeds and a 5-quart stainless steel bowl.",
    price: { amount: 499, currency: "EUR" },
    _id: "6710abc1234567890abc0013",
    images: [p_img13],
    category: "Kitchen",
    stock: 40,
    averageRating: 4.9,
    reviewCount: 91,
    offer: "20%",
  },
  {
    title: "Apple Watch Series 9",
    description:
      "Smartwatch with health tracking, Always-On Retina display, and fitness monitoring.",
    price: { amount: 52000, currency: "BDT" },
    _id: "6710abc1234567890abc0014",
    images: [p_img14],
    category: "Wearables",
    stock: 65,
    averageRating: 4.7,
    reviewCount: 198,
    offer: "27%",
  },
  {
    title: "JBL Flip 6 Bluetooth Speaker",
    description: "Portable waterproof speaker with bold sound and deep bass.",
    price: { amount: 11500, currency: "BDT" },
    _id: "6710abc1234567890abc0015",
    images: [p_img15],
    category: "Audio",
    stock: 100,
    averageRating: 4.6,
    reviewCount: 203,
    offer: "20%",
  },
  {
    title: "Sony PlayStation 5",
    description:
      "Next-gen gaming console with ultra-fast SSD and ray-traced graphics.",
    price: { amount: 92000, currency: "BDT" },
    _id: "6710abc1234567890abc0016",
    images: [p_img16],
    category: "Gaming",
    stock: 35,
    averageRating: 4.9,
    reviewCount: 451,
    offer: "20%",
  },
  {
    title: "Razer BlackWidow V4 Mechanical Keyboard",
    description:
      "RGB gaming keyboard with programmable macros and tactile switches.",
    price: { amount: 18500, currency: "BDT" },
    _id: "6710abc1234567890abc0017",
    images: [p_img17],
    category: "Accessories",
    stock: 45,
    averageRating: 4.7,
    reviewCount: 138,
    offer: "20%",
  },
  {
    title: "Amazon Echo Dot (5th Gen)",
    description:
      "Smart speaker with Alexa voice assistant and enhanced sound quality.",
    price: { amount: 4500, currency: "BDT" },
    _id: "6710abc1234567890abc0018",
    images: [p_img18],
    category: "Smart Home",
    stock: 90,
    averageRating: 4.5,
    reviewCount: 155,
    offer: "20%",
  },
  {
    title: "Lenovo Legion 5 Gaming Laptop",
    description:
      "Powerful gaming laptop with RTX 3060, Ryzen 7, and 144Hz display.",
    price: { amount: 145000, currency: "BDT" },
    _id: "6710abc1234567890abc0019",
    images: [p_img19],
    category: "Laptops",
    stock: 25,
    averageRating: 4.8,
    reviewCount: 167,
    offer: "20%",
  },
  {
    title: "Fitbit Charge 6 Fitness Tracker",
    description:
      "Compact fitness tracker with heart rate monitor, GPS, and sleep tracking.",
    price: { amount: 16500, currency: "BDT" },
    _id: "6710abc1234567890abc0020",
    images: [p_img20],
    category: "Wearables",
    stock: 55,
    averageRating: 4.6,
    reviewCount: 142,
    offer: "20%",
  },
];
