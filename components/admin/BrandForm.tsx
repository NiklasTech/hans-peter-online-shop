"use client";

/**
 * Brand Form Component
 *
 * Reusable form component for creating and editing brands.
 * Used in both /admin/brand and /admin/brand/[id] pages.
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface BrandFormProps {
  brandId?: number;
  isEditing?: boolean;
}

interface Brand {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
}

export default function BrandForm({ brandId, isEditing = false }: BrandFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteExistingImage, setDeleteExistingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load brand data if editing
  useEffect(() => {
    if (isEditing && brandId) {
      loadBrand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, isEditing]);

  const loadBrand = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/brands?id=${brandId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Marke");
      }

      const data = await response.json();
      const brand: Brand = data.brand;

      // Populate form
      setName(brand.name);
      setDescription(brand.description || "");
      setCurrentImage(brand.image || null);
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

      if (isEditing && brandId) {
        formData.append("id", brandId.toString());
      }

      if (newImage) {
        formData.append("image", newImage);
      }

      if (deleteExistingImage) {
        formData.append("deleteImage", "true");
      }

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch("/api/admin/brands", {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Speichern der Marke");
      }

      await response.json();
      setSuccess(true);

      // Redirect to brands list after short delay
      setTimeout(() => {
        router.push("/admin/brands");
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
        <div className="text-lg text-gray-600">Lädt Markendaten...</div>
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
          Marke erfolgreich {isEditing ? "aktualisiert" : "erstellt"}! Weiterleitung...
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
              placeholder="z.B. Samsung, Apple, Sony"
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
              placeholder="Optionale Beschreibung der Marke..."
              disabled={saving}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Marken-Bild</CardTitle>
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
                    alt="Brand preview"
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

          {/* Upload Button */}
          {!imagePreview && !currentImage && (
            <div className="space-y-2">
              <Label>Bild hochladen (Optional)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isDragging ? "Datei hier ablegen..." : "Bild hochladen"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isDragging ? "Loslassen zum Hochladen" : "Drag & Drop oder klicken • PNG, JPG, WebP bis zu 5MB"}
                    </p>
                  </div>
                  {!isDragging && (
                    <Button type="button" variant="secondary" size="sm" disabled={saving}>
                      <Upload className="mr-2 h-4 w-4" />
                      Datei auswählen
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            disabled={saving}
          />

          {(imagePreview || currentImage) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              <Upload className="mr-2 h-4 w-4" />
              Anderes Bild auswählen
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/brands")}
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
            : "Marke erstellen"}
        </Button>
      </div>
    </form>
  );
}

