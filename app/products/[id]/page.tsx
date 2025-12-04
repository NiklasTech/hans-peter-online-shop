import ProductDetailPage from "@/components/ProductDetailPage";

interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku: string;
  category: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  reviews: ProductReview[];
}

// Mock data - in production this would come from a database
const mockProducts: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 149.99,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    sku: "WH-1000XM4",
    category: "Elektronik > Audio",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    ],
    description:
      "Diese Premium Wireless Headphones bieten ausgezeichnete Klangqualität mit aktiver Geräuschunterdrückung. Mit einer Akkulaufzeit von bis zu 30 Stunden sind sie perfekt für lange Reisen. Die bequeme Polsterung und das leichte Design machen sie ideal für tägliche Nutzung.",
    specifications: {
      Marke: "Premium Audio",
      Kabellos: "Ja",
      Geräuschunterdrückung: "Aktiv",
      Akkulaufzeit: "30 Stunden",
      "Bluetooth Version": "5.0",
      Impedanz: "32 Ohm",
      Gewicht: "250g",
      Garantie: "2 Jahre",
    },
    reviews: [
      {
        id: "1",
        author: "Max Müller",
        rating: 5,
        title: "Ausgezeichnete Kopfhörer!",
        content:
          "Die Soundqualität ist wirklich beeindruckend. Die Geräuschunterdrückung funktioniert perfekt, und die Akkulaufzeit ist besser als erwartet.",
        date: "15. November 2024",
        helpful: 47,
      },
      {
        id: "2",
        author: "Sarah Schmidt",
        rating: 4,
        title: "Sehr zufrieden",
        content:
          "Gute Kopfhörer zu einem fairen Preis. Nur die Passform könnte bei langen Tragezeiten etwas angenehmer sein.",
        date: "10. November 2024",
        helpful: 23,
      },
      {
        id: "3",
        author: "Hans Weber",
        rating: 5,
        title: "Beste Investition!",
        content:
          "Ich bin begeistert von der Qualität. Der Tragekomfort ist hervorragend und der Klang überzeigt völlig.",
        date: "5. November 2024",
        helpful: 61,
      },
    ],
  },
  "2": {
    id: "2",
    name: "Ultra Fast USB-C Charger",
    price: 49.99,
    rating: 4.8,
    reviewCount: 256,
    inStock: true,
    sku: "UC-65W",
    category: "Elektronik > Zubehör",
    images: [
      "https://images.unsplash.com/photo-1619290228146-6f69e5fb34a4?w=800&q=80",
      "https://images.unsplash.com/photo-1619290228146-6f69e5fb34a4?w=800&q=80",
    ],
    description:
      "Schnelle USB-C Ladegerät mit bis zu 65W Leistung. Perfekt für Laptops, Tablets und Smartphones. Kompaktes Design und international kompatibel.",
    specifications: {
      Leistung: "65W",
      Anschlüsse: "2x USB-C",
      Zertifizierung: "CE, FCC",
      Material: "Aluminium",
      Länge: "1,5m",
    },
    reviews: [],
  },
};

const relatedProductsMock = [
  {
    id: "2",
    name: "Ultra Fast USB-C Charger",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1619290228146-6f69e5fb34a4?w=400&q=80",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Portable Speaker",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    rating: 4.6,
  },
  {
    id: "4",
    name: "Phone Stand",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1605775972915-c3400ca199e7?w=400&q=80",
    rating: 4.3,
  },
  {
    id: "5",
    name: "Cable Organizer",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",
    rating: 4.5,
  },
];

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = mockProducts[id];

  return {
    title: product ? product.name : "Produkt nicht gefunden",
    description: product ? product.description : "",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = mockProducts[id];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Produkt nicht gefunden
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Das gesuchte Produkt existiert nicht.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      relatedProducts={relatedProductsMock}
    />
  );
}
