"use client";

/**
 * Product Form Component
 *
 * Reusable form component for creating and editing products.
 * Used in both /admin/product and /admin/product/[id] pages.
 *
 * TODO: Implement form fields and submission logic
 */

interface ProductFormProps {
  productId?: string;
  isEditing?: boolean;
}

export default function ProductForm({
  productId,
  isEditing = false,
}: ProductFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <form className="space-y-6">
        {/* TODO: Add form fields */}
        {/* - Product Name */}
        {/* - Description */}
        {/* - Price */}
        {/* - Stock */}
        {/* - Category */}
        {/* - Image Upload */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            {isEditing
              ? `Formular zum Bearbeiten von Produkt ${productId}`
              : "Formular zum Erstellen eines neuen Produkts"}
          </p>
        </div>
      </form>
    </div>
  );
}
