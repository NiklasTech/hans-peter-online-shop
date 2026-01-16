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
  salePrice?: number;
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

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface DbProductCategory {
  category: {
    name: string;
  };
}

interface DbProductImage {
  url: string;
  previewUrl?: string;
}

interface DbProductDetail {
  key: string;
  value: string;
}

interface DbProductReview {
  id: number;
  user: {
    name: string;
  };
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  helpful: number;
}

interface DbProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  previewImage?: string | null;
  stock: number;
  sku: string;
  categories: DbProductCategory[];
  images: DbProductImage[];
  details: DbProductDetail[];
  reviews: DbProductReview[];
  averageRating?: number;
  reviewCount?: number;
  brand?: {
    name: string;
  };
}

async function fetchProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function fetchRelatedProducts(
  categoryIds: number[],
  currentProductId: number,
  limit: number = 4
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/products/related?categoryIds=${categoryIds.join(
        ","
      )}&excludeId=${currentProductId}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

function transformProductData(dbProduct: DbProduct): Product {
  // Transform categories to category string
  const categoryString = dbProduct.categories
    .map((pc) => pc.category.name)
    .join(" > ");

  // Transform images to string array - use url with previewUrl as fallback
  const images = dbProduct.images
    .map((img) => img.url || img.previewUrl)
    .filter((url): url is string => !!url);

  // Transform details to specifications object
  const specifications: Record<string, string> = {};
  if (dbProduct.brand) {
    specifications["Marke"] = dbProduct.brand.name;
  }
  dbProduct.details.forEach((detail) => {
    specifications[detail.key] = detail.value;
  });

  // Transform reviews
  const reviews: ProductReview[] = dbProduct.reviews.map((review) => ({
    id: review.id.toString(),
    author: review.user.name,
    rating: review.rating,
    title: review.title || "",
    content: review.comment || "",
    date: new Date(review.createdAt).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    helpful: review.helpful || 0,
  }));

  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    price: dbProduct.price,
    salePrice: dbProduct.salePrice || undefined,
    rating: dbProduct.averageRating || 0,
    reviewCount: dbProduct.reviewCount || 0,
    inStock: dbProduct.stock > 0,
    sku: dbProduct.sku || `SKU-${dbProduct.id}`,
    category: categoryString,
    images: images.length > 0 ? images : [dbProduct.previewImage || ""],
    description: dbProduct.description || "",
    specifications,
    reviews,
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const dbProduct = await fetchProduct(id);

  if (!dbProduct) {
    return {
      title: "Produkt nicht gefunden",
      description: "",
    };
  }

  return {
    title: dbProduct.name,
    description: dbProduct.description || "",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const dbProduct = await fetchProduct(id);

  if (!dbProduct) {
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

  // Transform database product to component format
  const product = transformProductData(dbProduct);

  // Fetch related products based on categories
  const categoryIds = dbProduct.categories.map(
    (pc: { categoryId: number }) => (pc as { categoryId: number }).categoryId
  );
  const dbRelatedProducts = await fetchRelatedProducts(
    categoryIds,
    dbProduct.id,
    4
  );

  // Transform related products
  const relatedProducts = dbRelatedProducts.map((rp: DbProduct) => ({
    id: rp.id.toString(),
    name: rp.name,
    price: rp.price,
    salePrice: rp.salePrice || undefined,
    image: rp.previewImage || rp.images[0]?.url || "",
    rating: rp.averageRating || 0,
  }));

  return (
    <ProductDetailPage product={product} relatedProducts={relatedProducts} />
  );
}
