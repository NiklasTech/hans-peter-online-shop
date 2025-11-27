"use client";

import { useParams } from "next/navigation";

/**
 * Admin Edit Product Page
 * Route: /admin/product/[id]
 *
 * Form to edit an existing product
 */

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Produkt bearbeiten (ID: {productId})</h1>
      {/* TODO: Import and use ProductForm component with product data */}
      <p>Formular zum Bearbeiten des Produkts</p>
    </div>
  );
}
