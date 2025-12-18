"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";

interface ProfileTabProps {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    isAdmin: boolean;
  };
  onUpdate: () => void;
}

export default function ProfileTab({ user, onUpdate }: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profil erfolgreich aktualisiert!");
      setEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profilinformationen</CardTitle>
            <CardDescription>Zeige und verwalte deine persönlichen Informationen</CardDescription>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>Profil bearbeiten</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {success}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Speichern..." : "Änderungen speichern"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">E-Mail</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Mitglied seit</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {user.isAdmin && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Kontotyp</p>
                  <Badge variant="default" className="mt-1">Administrator</Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
