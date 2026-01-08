"use client";

/**
 * Admin Edit User Page
 * Route: /admin/user/[id]
 *
 * Form to edit an existing user
 */

import { use } from "react";
import UserForm from "@/components/admin/UserForm";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userId = parseInt(id);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 space-y-6 max-w-4xl mx-auto">Benutzer bearbeiten</h1>
      <UserForm userId={userId} isEditing={true} />
    </div>
  );
}

