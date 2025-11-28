"use client";

/**
 * Admin Edit Product Page
 * Route: /admin/product/[id]
 *
 * Form to edit an existing product
 */

import { use } from "react";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = parseInt(id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 space-y-6 max-w-4xl mx-auto">Produkt bearbeiten</h1>
      <ProductForm productId={productId} isEditing={true} />
    </div>
  );
}
