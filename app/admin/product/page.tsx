"use client";

/**
 * Admin Create New Product Page
 * Route: /admin/product
 *
 * Form to create a new product
 */

import ProductForm from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Neues Produkt erstellen</h1>
      <ProductForm isEditing={false} />
    </div>
  );
}
