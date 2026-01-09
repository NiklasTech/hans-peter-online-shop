"use client";

/**
 * Admin New Category Page
 * Route: /admin/category
 *
 * Form to create a new category
 */

import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Neue Kategorie erstellen</h1>
      <CategoryForm isEditing={false} />
    </div>
  );
}

