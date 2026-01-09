"use client";

/**
 * Admin Edit Category Page
 * Route: /admin/category/[id]
 *
 * Form to edit an existing category
 */

import { use } from "react";
import CategoryForm from "@/components/admin/CategoryForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const categoryId = parseInt(resolvedParams.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Kategorie bearbeiten</h1>
      <CategoryForm categoryId={categoryId} isEditing={true} />
    </div>
  );
}

