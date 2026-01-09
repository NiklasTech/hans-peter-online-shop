"use client";

/**
 * User Form Component
 *
 * Reusable form component for creating and editing users.
 * Used in both /admin/user and /admin/user/[id] pages.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormProps {
  userId?: number;
  isEditing?: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  defaultSupplier?: string | null;
  defaultPayment?: string | null;
}

export default function UserForm({ userId, isEditing = false }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [defaultSupplier, setDefaultSupplier] = useState("");
  const [defaultPayment, setDefaultPayment] = useState("");

  // Load user data if editing
  useEffect(() => {
    if (isEditing && userId) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isEditing]);

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden des Benutzers");
      }

      const data = await response.json();
      const user: User = data.user;

      // Populate form
      setEmail(user.email);
      setName(user.name);
      setIsAdmin(user.isAdmin);
      setDefaultSupplier(user.defaultSupplier || "");
      setDefaultPayment(user.defaultPayment || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    // Email validation
    if (!email || !email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return false;
    }

    // Name validation
    if (!name || name.trim().length < 2) {
      setError("Bitte geben Sie einen gültigen Namen ein (min. 2 Zeichen)");
      return false;
    }

    // Password validation (only for new users or when changing password)
    if (!isEditing || password) {
      if (!password || password.length < 6) {
        setError("Das Passwort muss mindestens 6 Zeichen lang sein");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Die Passwörter stimmen nicht überein");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const userData: {
        email: string;
        name: string;
        isAdmin: boolean;
        defaultSupplier: string | null;
        defaultPayment: string | null;
        password?: string;
        id?: number;
      } = {
        email,
        name,
        isAdmin,
        defaultSupplier: defaultSupplier || null,
        defaultPayment: defaultPayment || null,
      };

      // Only include password if it's set
      if (password) {
        userData.password = password;
      }

      // Add userId for editing
      if (isEditing && userId) {
        userData.id = userId;
      }

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch("/api/admin/users", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern des Benutzers");
      }

      await response.json();
      setSuccess(true);

      // Redirect to users list after short delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Lädt Benutzerdaten...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Benutzer erfolgreich {isEditing ? "aktualisiert" : "erstellt"}! Weiterleitung...
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Grundinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">E-Mail-Adresse *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="benutzer@example.com"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Mustermann"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="password">
              Passwort {isEditing ? "(leer lassen, um nicht zu ändern)" : "*"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditing}
              disabled={saving}
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              Mindestens 6 Zeichen
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              Passwort bestätigen {isEditing ? "" : "*"}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditing && !!password}
              disabled={saving}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked === true)}
              disabled={saving}
            />
            <Label htmlFor="isAdmin" className="cursor-pointer">
              Administrator-Rechte
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Default Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Standardeinstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="defaultSupplier">Standard-Lieferant</Label>
            <Input
              id="defaultSupplier"
              type="text"
              value={defaultSupplier}
              onChange={(e) => setDefaultSupplier(e.target.value)}
              placeholder="z.B. DHL, Hermes"
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="defaultPayment">Standard-Zahlungsmethode</Label>
            <Input
              id="defaultPayment"
              type="text"
              value={defaultPayment}
              onChange={(e) => setDefaultPayment(e.target.value)}
              placeholder="z.B. Kreditkarte, PayPal"
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
          disabled={saving}
          className="cursor-pointer"
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={saving} className="cursor-pointer">
          {saving
            ? "Speichert..."
            : isEditing
            ? "Änderungen speichern"
            : "Benutzer erstellen"}
        </Button>
      </div>
    </form>
  );
}

