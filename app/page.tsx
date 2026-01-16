import ProductSection from "@/components/ProductSection";
import { CategorieSection } from "@/components/CategorieSection";
import { BrandSection } from "@/components/BrandSection";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

export default async function Home() {
  // Lade echte Daten aus der Datenbank
  const [featuredProducts, newProducts, categories, brands] = await Promise.all([
    // Empfohlene Produkte: Zufällige Auswahl von 5 Produkten
    db.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    }),

    // Neue Produkte: Neueste 5 Produkte
    db.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      skip: 5, // Überspringe die ersten 5, damit andere Produkte gezeigt werden
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    }),

    // Kategorien mit Produktanzahl
    db.category.findMany({
      include: {
        products: {
          select: { productId: true }
        }
      }
    }),

    // Alle Marken laden (für zufällige Auswahl)
    db.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
  ]);

  // Zufällige 5 Marken auswählen
  const shuffledBrands = [...brands].sort(() => Math.random() - 0.5).slice(0, 5);

  // Transformiere Produkte für ProductSection
  const transformProducts = (products: typeof featuredProducts) =>
    products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      price: p.price,
      salePrice: p.salePrice || undefined,
      rating: p.reviews.length > 0
        ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
        : 0,
      image: p.previewImage || undefined
    }));

  // Transformiere Kategorien
  const transformedCategories = categories.map(c => ({
    id: c.id.toString(),
    name: c.name,
    productCount: c.products.length,
    image: c.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  }));

  // Transformiere Marken (zufällige Auswahl)
  const transformedBrands = shuffledBrands.map(b => ({
    id: b.id.toString(),
    name: b.name,
    description: b.description || `${b._count.products} Produkte`,
    logo: b.image || undefined
  }));

  return (
    <>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductSection
            title="Empfohlene Produkte"
            products={transformProducts(featuredProducts)}
          />

          <div className="mb-12">
            <Banner
              title="Summer Sale"
              subtitle="Bis zu 50% Rabatt auf ausgewählte Artikel"
              height="medium"
              variant="sale"
              badge="Limitiert"
              ctaText="Jetzt shoppen"
              ctaLink="/search?discount=true"
            />
          </div>

          <ProductSection
            title="Neue Arrivals"
            products={transformProducts(newProducts)}
          />

          <div className="mb-12">
            <Banner
              title="Kostenloser Versand"
              subtitle="Bei Bestellungen ab 50€ - schnell & zuverlässig"
              height="small"
              variant="promo"
              ctaText="Mehr erfahren"
              ctaLink="/shipping"
            />
          </div>

          <CategorieSection
            title="Kategorien"
            categories={transformedCategories}
          />

          <div className="mb-12">
            <Banner
              title="Premium Qualität"
              subtitle="Entdecken Sie unsere exklusiven Markenprodukte"
              height="medium"
              variant="brand"
              badge="Exklusiv"
              ctaText="Marken entdecken"
              ctaLink="/brands"
            />
          </div>

          <BrandSection
            title="Unsere Marken"
            brands={transformedBrands}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
