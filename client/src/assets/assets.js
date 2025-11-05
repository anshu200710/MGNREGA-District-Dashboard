// Import all images
import laptop1 from "./download.jpeg";
import laptop2 from "./download (1).jpeg";
import mobile1 from "./download (2).jpeg";
import mobile2 from "./download (3).jpeg";
import tablet1 from "./download (4).jpeg";
import tablet2 from "./download (5).jpeg";
import earphone1 from "./download (6).jpeg";
import earphone2 from "./download (7).jpeg";
import cover1 from "./download (8).jpeg";
import cover2 from "./download (9).jpeg";

// Export as assets object (if needed globally)
export const assets = {
  laptop1,
  laptop2,
  mobile1,
  mobile2,
  tablet1,
  tablet2,
  earphone1,
  earphone2,
  cover1,
  cover2,
};

// Products array
export const products = [
  {
    id: 1,
    name: "HP Pavilion Laptop",
    price: 55000,
    category: "Laptop",
    image: laptop1,
    description: "Powerful laptop with Intel i5, 8GB RAM, 512GB SSD."
  },
  {
    id: 2,
    name: "Dell Inspiron Laptop",
    price: 60000,
    category: "Laptop",
    image: laptop2,
    description: "Stylish laptop with Ryzen 5, 16GB RAM, 1TB SSD."
  },
  {
    id: 3,
    name: "iPhone 14",
    price: 70000,
    category: "Mobile",
    image: mobile1,
    description: "Latest Apple iPhone with A15 Bionic Chip."
  },
  {
    id: 4,
    name: "Samsung Galaxy S23",
    price: 65000,
    category: "Mobile",
    image: mobile2,
    description: "Flagship Samsung mobile with Snapdragon 8 Gen 2."
  },
  {
    id: 5,
    name: "iPad Air",
    price: 45000,
    category: "Tablet",
    image: tablet1,
    description: "Apple iPad with M1 chip and 10.9-inch display."
  },
  {
    id: 6,
    name: "Samsung Tab S8",
    price: 40000,
    category: "Tablet",
    image: tablet2,
    description: "Samsung flagship tab with S-pen support."
  },
  {
    id: 7,
    name: "Boat Airdopes",
    price: 2000,
    category: "Earphones",
    image: earphone1,
    description: "Wireless earbuds with deep bass."
  },
  {
    id: 8,
    name: "Sony Earbuds",
    price: 5000,
    category: "Earphones",
    image: earphone2,
    description: "Noise cancelling wireless earphones."
  },
  {
    id: 9,
    name: "iPhone Cover",
    price: 500,
    category: "Mobile Cover",
    image: cover1,
    description: "Stylish mobile cover with shock protection."
  },
  {
    id: 10,
    name: "Samsung Cover",
    price: 400,
    category: "Mobile Cover",
    image: cover2,
    description: "Premium back cover for Samsung Galaxy."
  }
];
