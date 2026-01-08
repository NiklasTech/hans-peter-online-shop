"use client";

/**
 * Admin Create New User Page
 * Route: /admin/user
 *
 * Form to create a new user
 */

import UserForm from "@/components/admin/UserForm";

export default function CreateUserPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Neuen Benutzer erstellen</h1>
      <UserForm isEditing={false} />
    </div>
  );
}

