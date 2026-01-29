import { db } from "@/lib/db";
import { BrandSection } from "@/components/BrandSection";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, TrendingUp, Package } from "lucide-react";

export const metadata = {
  title: "Alle Marken - Hans Peter Online Shop",
  description: "Entdecken Sie alle unsere Premium-Marken und exklusiven Produkte",
};

export default async function BrandsPage() {
  // Lade alle Marken mit Produktanzahl
  const brands = await db.brand.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transformiere Marken für BrandSection
  const transformedBrands = brands.map((b) => ({
    id: b.id.toString(),
    name: b.name,
    description: b.description || `${b._count.products} Produkte`,
    logo: b.image || undefined,
  }));

  // Statistiken berechnen
  const totalBrands = brands.length;
  const totalProducts = brands.reduce((sum, b) => sum + b._count.products, 0);
  const avgProductsPerBrand = totalProducts > 0 ? Math.round(totalProducts / totalBrands) : 0;

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="w-10 h-10 text-blue-600" />
              Unsere Marken
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Entdecken Sie {totalBrands} Premium-Marken mit über {totalProducts} exklusiven
              Produkten
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalBrands}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marken</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalProducts}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Produkte</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/50 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ∅ {avgProductsPerBrand}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Produkte pro Marke
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Brands Banner */}
          <Card className="mb-8 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    Premium Qualität garantiert
                  </h2>
                  <p className="text-blue-800 dark:text-blue-200">
                    Alle unsere Marken wurden sorgfältig ausgewählt und bieten höchste Qualität
                    und erstklassigen Service. Entdecke die perfekte Marke für deine Bedürfnisse.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brands Grid */}
          {brands.length > 0 ? (
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 sm:p-8">
              <BrandSection brands={transformedBrands} title="" />
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Tag className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Keine Marken gefunden
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aktuell sind keine Marken verfügbar.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  Warum unsere Marken?
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Sorgfältig ausgewählte Premium-Marken</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Höchste Qualitätsstandards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Authentische Original-Produkte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Exklusive Markenpartnerschaften</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  Deine Vorteile
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Kostenloser Versand ab 50€</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>14 Tage Rückgaberecht</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Sichere Zahlung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Schnelle Lieferung in 2-3 Tagen</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
