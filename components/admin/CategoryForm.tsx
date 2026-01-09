"use client";

/**
 * Category Form Component
 *
 * Reusable form component for creating and editing categories.
 * Used in both /admin/category and /admin/category/[id] pages.
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CategoryFormProps {
  categoryId?: number;
  isEditing?: boolean;
}

interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  parentId?: number | null;
  parent?: {
    id: number;
    name: string;
  } | null;
}

export default function CategoryForm({ categoryId, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteExistingImage, setDeleteExistingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load category data if editing
  useEffect(() => {
    loadAvailableCategories();
    if (isEditing && categoryId) {
      loadCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isEditing]);

  const loadAvailableCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        const categories = data.categories || [];
        // Filter out the current category if editing
        const filtered = isEditing && categoryId
          ? categories.filter((cat: Category) => cat.id !== categoryId)
          : categories;
        setAvailableCategories(filtered);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadCategory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Kategorie");
      }

      const data = await response.json();
      const category: Category = data.category;

      // Populate form
      setName(category.name);
      setDescription(category.description || "");
      setCurrentImage(category.image || null);
      setParentId(category.parentId ? category.parentId.toString() : "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Bitte wählen Sie eine Bilddatei aus");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Bild darf maximal 5 MB groß sein");
      return;
    }

    setNewImage(file);
    setDeleteExistingImage(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleRemoveNewImage = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteExistingImage = () => {
    setDeleteExistingImage(true);
    setCurrentImage(null);
  };

  const validateForm = (): boolean => {
    // Name validation
    if (!name || name.trim().length < 2) {
      setError("Bitte geben Sie einen gültigen Namen ein (min. 2 Zeichen)");
      return false;
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
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (parentId) {
        formData.append("parentId", parentId);
      }

      if (isEditing && categoryId) {
        formData.append("id", categoryId.toString());
      }

      if (newImage) {
        formData.append("image", newImage);
      }

      if (deleteExistingImage) {
        formData.append("deleteImage", "true");
      }

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch("/api/admin/categories", {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern der Kategorie");
      }

      await response.json();
      setSuccess(true);

      // Redirect to categories list after short delay
      setTimeout(() => {
        router.push("/admin/categories");
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
        <div className="text-lg text-gray-600">Lädt Kategoriedaten...</div>
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
          Kategorie erfolgreich {isEditing ? "aktualisiert" : "erstellt"}! Weiterleitung...
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Grundinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Smartphones, Laptops, Zubehör"
              required
              disabled={saving}
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optionale Beschreibung der Kategorie..."
              disabled={saving}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="parentId">Überkategorie (optional)</Label>
            <Select
              value={parentId || "none"}
              onValueChange={(value) => setParentId(value === "none" ? "" : value)}
              disabled={saving}
            >
              <SelectTrigger id="parentId">
                <SelectValue placeholder="Keine Überkategorie (Hauptkategorie)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine Überkategorie (Hauptkategorie)</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Wählen Sie eine übergeordnete Kategorie aus, um eine Hierarchie zu erstellen
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Kategorie-Bild</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current/New Image Preview */}
          {(imagePreview || currentImage) && (
            <div className="space-y-2">
              <Label>Aktuelles Bild</Label>
              <div className="relative w-full max-w-md">
                <div className="relative w-full h-48 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                  <Image
                    src={imagePreview || currentImage || ""}
                    alt="Category preview"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    if (imagePreview) {
                      handleRemoveNewImage();
                    } else {
                      handleDeleteExistingImage();
                    }
                  }}
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          {!imagePreview && !currentImage && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${saving ? "opacity-50 pointer-events-none" : ""}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
                disabled={saving}
              />
              <div className="flex flex-col items-center gap-2">
                {isDragging ? (
                  <>
                    <Upload className="h-12 w-12 text-blue-500" />
                    <p className="text-blue-600 font-medium">Jetzt loslassen...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 font-medium">
                      Bild hierher ziehen oder klicken zum Auswählen
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF bis 5 MB</p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
          disabled={saving}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Wird gespeichert..." : isEditing ? "Änderungen speichern" : "Kategorie erstellen"}
        </Button>
      </div>
    </form>
  );
}

