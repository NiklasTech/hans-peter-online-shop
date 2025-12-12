import ProductSection from "@/components/ProductSection";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CategoryData {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string | null;
  rating: number;
}

async function fetchCategory(slug: string): Promise<{
  category: CategoryData;
  products: ProductData[];
} | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/categories/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await fetchCategory(slug);

  if (!data) {
    return {
      title: "Kategorie nicht gefunden",
      description: "",
    };
  }

  return {
    title: `${data.category.name} - Hans Peter Shop`,
    description: data.category.description || `Alle Produkte in ${data.category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await fetchCategory(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kategorie nicht gefunden
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Die gesuchte Kategorie existiert nicht.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { category, products } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {products.length} {products.length === 1 ? "Produkt" : "Produkte"}
          </p>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <ProductSection products={products} />
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-2xl">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              In dieser Kategorie sind noch keine Produkte vorhanden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
