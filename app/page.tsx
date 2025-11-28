"use client";

import ProductSection from "@/components/ProductSection";
import { CategorieSection } from "@/components/CategorieSection";
import { BrandSection } from "@/components/BrandSection";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

// Placeholder products data. Später wird dies von der Datenbank kommen
const featuredProducts = [
  { id: "1", name: "Premium T-Shirt", price: 29.99, rating: 5 },
  { id: "2", name: "Classic Jeans", price: 79.99, rating: 4.5 },
  { id: "3", name: "Leather Jacket", price: 149.99, rating: 5 },
  { id: "4", name: "White Sneakers", price: 89.99, rating: 4 },
  { id: "5", name: "Baseball Cap", price: 24.99, rating: 4.5 },
];

const productSection2 = [
  { id: "6", name: "Summer Dress", price: 59.99, rating: 5 },
  { id: "7", name: "Shorts Set", price: 45.99, rating: 4.5 },
  { id: "8", name: "Polo Shirt", price: 39.99, rating: 4 },
  { id: "9", name: "Casual Pants", price: 69.99, rating: 4.5 },
  { id: "10", name: "Sport Shoes", price: 99.99, rating: 5 },
];

const categories = [
  {
    id: "c1",
    name: "Elektronik",
    productCount: 245,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "c2",
    name: "Mode",
    productCount: 512,
    image:
      "https://media.istockphoto.com/id/2214003347/de/foto/junger-sportler-h%C3%A4lt-basketball-vor-roter-t%C3%BCr.webp?s=2048x2048&w=is&k=20&c=sMK5EIDg-qwP00HqN82cu62F0mGS83ar_-zr18TM7uc=",
  },
  {
    id: "c3",
    name: "Haushalt",
    productCount: 178,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "c4",
    name: "Sport",
    productCount: 89,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "c5",
    name: "Bücher",
    productCount: 334,
    image:
      "https://media.istockphoto.com/id/1151637440/de/foto/viele-neue-b%C3%BCcher-in-hardcover.webp?s=2048x2048&w=is&k=20&c=_FIZktrDxAjOt4xRNo10eWVD5u98BwNVfXHrSfIkIiE=",
  },
];

const brands = [
  {
    id: "b1",
    name: "NVIDIA",
    description: "Gaming & AI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1200px-Nvidia_logo.svg.png",
  },
  {
    id: "b2",
    name: "AMD",
    description: "Processors",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/800px-AMD_Logo.svg.png",
  },
  {
    id: "b3",
    name: "Intel",
    description: "Computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2023.svg/2560px-Intel_logo_2023.svg.png",
  },
  {
    id: "b4",
    name: "ASUS",
    description: "Tech Hardware",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/ASUS_Logo-neu.svg/512px-ASUS_Logo-neu.svg.png",
  },
  {
    id: "b5",
    name: "MSI",
    description: "Gaming Gear",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Logo_MicroStarInternational.svg",
  },
];

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductSection
            title="Empfohlene Produkte"
            products={featuredProducts}
          />

          <div className="mb-12">
            <Banner
              title="Sommerkollektion"
              subtitle="Jetzt bis zu 50% Rabatt"
              height="medium"
            />
          </div>

          <ProductSection title="Neue Arrivals" products={productSection2} />

          <div className="mb-12">
            <Banner
              title="Kategorien erkunden"
              subtitle="Finden Sie genau das, was Sie suchen"
              height="medium"
            />
          </div>

          <CategorieSection title="Kategorien" categories={categories} />

          <div className="mb-12">
            <Banner
              title="Exklusive Marken"
              subtitle="Entdecken Sie unsere Top-Hersteller"
              height="medium"
            />
          </div>

          <BrandSection title="Unsere Marken" brands={brands} />
        </div>
      </main>
      <Footer />
    </>
  );
}
