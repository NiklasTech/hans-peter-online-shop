import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Product Search API
 * GET /api/products/search?q=query&categories=1,2&brands=1,2&minPrice=0&maxPrice=100&inStock=true&discount=true
 *
 * Searches and filters products by:
 * - Product name (q parameter)
 * - Product ID (q parameter if numeric)
 * - Product description (q parameter)
 * - Brand name (q parameter)
 * - Categories (categories parameter - comma separated IDs)
 * - Brands (brands parameter - comma separated IDs)
 * - Price range (minPrice, maxPrice parameters)
 * - Stock availability (inStock parameter)
 * - Discount/Sale (discount parameter - shows only products with salePrice)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const categoriesParam = searchParams.get("categories");
    const brandsParam = searchParams.get("brands");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const inStockParam = searchParams.get("inStock");
    const discountParam = searchParams.get("discount");

    // Parse filter parameters
    const categoryIds = categoriesParam
      ? categoriesParam.split(",").map(Number).filter((n) => !isNaN(n))
      : [];
    const brandIds = brandsParam
      ? brandsParam.split(",").map(Number).filter((n) => !isNaN(n))
      : [];
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : null;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : null;
    const inStockOnly = inStockParam === "true";
    const discountOnly = discountParam === "true";

    // Check if any filter is active
    const hasFilters =
      query ||
      categoryIds.length > 0 ||
      brandIds.length > 0 ||
      minPrice !== null ||
      maxPrice !== null ||
      inStockOnly ||
      discountOnly;

    // Return empty results if no query or filters provided
    if (!hasFilters) {
      return NextResponse.json({ products: [], count: 0 });
    }

    const searchTerm = query?.trim().toLowerCase() || "";
    const isNumericSearch = searchTerm && !isNaN(Number(searchTerm));

    // Build where conditions
    const whereConditions: Prisma.ProductWhereInput = {
      AND: [],
    };

    const andConditions = whereConditions.AND as Prisma.ProductWhereInput[];

    // Text search conditions (if query provided)
    if (searchTerm) {
      const searchConditions: Prisma.ProductWhereInput = {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            brand: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      };

      // Add ID search if query is numeric
      if (isNumericSearch) {
        (searchConditions.OR as Prisma.ProductWhereInput[]).push({
          id: Number(searchTerm),
        });
      }

      andConditions.push(searchConditions);
    }

    // Category filter
    if (categoryIds.length > 0) {
      andConditions.push({
        categories: {
          some: {
            categoryId: {
              in: categoryIds,
            },
          },
        },
      });
    }

    // Brand filter
    if (brandIds.length > 0) {
      andConditions.push({
        brandId: {
          in: brandIds,
        },
      });
    }

    // Price range filter
    if (minPrice !== null || maxPrice !== null) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (minPrice !== null) {
        priceFilter.gte = minPrice;
      }
      if (maxPrice !== null) {
        priceFilter.lte = maxPrice;
      }
      andConditions.push({ price: priceFilter });
    }

    // Stock filter
    if (inStockOnly) {
      andConditions.push({
        stock: {
          gt: 0,
        },
      });
    }

    // Discount filter - only products with salePrice
    if (discountOnly) {
      andConditions.push({
        salePrice: {
          not: null,
        },
      });
    }

    // Query products with relations
    const products = await db.product.findMany({
      where: whereConditions,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            index: "asc",
          },
          take: 1,
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: 50, // Increased limit for filtered results
      orderBy: [
        // Prioritize exact ID matches
        ...(isNumericSearch ? [{ id: "asc" as const }] : []),
        // Then order by name
        { name: "asc" as const },
      ],
    });

    // Format the response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      previewImage: product.previewImage || product.images[0]?.url || null,
      stock: product.stock,
      brand: product.brand,
      categories: product.categories
        .map((c) => c.category?.name)
        .filter(Boolean),
    }));

    return NextResponse.json({
      products: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Fehler bei der Produktsuche" },
      { status: 500 }
    );
  }
}
