"use client";

/**
 * Admin Edit Brand Page
 * Route: /admin/brand/[id]
 *
 * Form to edit an existing brand
 */

import { use } from "react";
import BrandForm from "@/components/admin/BrandForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBrandPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const brandId = parseInt(resolvedParams.id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Marke bearbeiten</h1>
      <BrandForm brandId={brandId} isEditing={true} />
    </div>
  );
}

