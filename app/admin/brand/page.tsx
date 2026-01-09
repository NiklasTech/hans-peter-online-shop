"use client";

/**
 * Admin Create New Brand Page
 * Route: /admin/brand
 *
 * Form to create a new brand
 */

import BrandForm from "@/components/admin/BrandForm";

export default function CreateBrandPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Neue Marke erstellen</h1>
      <BrandForm isEditing={false} />
    </div>
  );
}

