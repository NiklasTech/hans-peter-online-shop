"use client";

/**
 * Product Form Component
 *
 * Reusable form component for creating and editing products.
 * Used in both /admin/product and /admin/product/[id] pages.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, GripVertical, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductFormProps {
  productId?: number;
  isEditing?: boolean;
}

interface ProductImage {
  id?: number;
  url: string;
  index: number;
  file?: File;
  uploading?: boolean;
}

interface DetailRow {
  id: string;
  key: string;
  value: string;
}

const DETAIL_KEY_SUGGESTIONS = [
  "Material",
  "Farbe",
  "Größe",
  "Gewicht",
  "Hersteller",
  "Herkunftsland",
  "Garantie",
  "Energieeffizienz",
  "Abmessungen",
  "Volumen",
];

export default function ProductForm({
  productId,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form-State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [details, setDetails] = useState<DetailRow[]>([
    { id: crypto.randomUUID(), key: "", value: "" },
  ]);

  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Produkt laden (bei Edit)
  const loadProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Produkt konnte nicht geladen werden");

      const data = await response.json();
      const product: Product = data.product;

      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setPreviewImage(product.previewImage || "");

      if (product.images) {
        setImages(
          product.images.map((img) => ({
            id: img.id,
            url: img.url,
            index: img.index,
          }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (isEditing && productId) {
      loadProduct();
    }
  }, [isEditing, productId, loadProduct]);

  // Bildupload
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload fehlgeschlagen");
    }

    const data = await response.json();
    return data.url;
  };

  // Dateien hinzufügen
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages: ProductImage[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const newImage: ProductImage = {
        url: URL.createObjectURL(file),
        index: images.length + newImages.length,
        file,
        uploading: true,
      };

      newImages.push(newImage);

      // Upload im Hintergrund
      uploadImage(file)
        .then((url) => {
          setImages((prev) =>
            prev.map((img) =>
              img.url === newImage.url
                ? { ...img, url, uploading: false }
                : img
            )
          );
        })
        .catch((err) => {
          console.error("Upload error:", err);
          setImages((prev) => prev.filter((img) => img.url !== newImage.url));
        });
    });

    setImages((prev) => [...prev, ...newImages]);
  };

  // Drag & Drop Handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Bild-Reihenfolge ändern
  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Indizes aktualisieren
    newImages.forEach((img, idx) => {
      img.index = idx;
    });

    setImages(newImages);
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };

  // Bild entfernen
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // Indizes neu zuweisen
      return newImages.map((img, idx) => ({ ...img, index: idx }));
    });
  };

  // Detail-Zeilen verwalten
  const updateDetail = (id: string, field: "key" | "value", value: string) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );

    // Wenn letzte Zeile bearbeitet wird, neue Zeile hinzufügen
    const detailIndex = details.findIndex((d) => d.id === id);
    if (detailIndex === details.length - 1 && (value.trim() !== "")) {
      setDetails((prev) => [
        ...prev,
        { id: crypto.randomUUID(), key: "", value: "" },
      ]);
    }
  };

  const removeDetail = (id: string) => {
    setDetails((prev) => {
      const filtered = prev.filter((detail) => detail.id !== id);
      // Mindestens eine leere Zeile behalten
      return filtered.length === 0
        ? [{ id: crypto.randomUUID(), key: "", value: "" }]
        : filtered;
    });
  };

  // Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validierung
      if (!name.trim()) throw new Error("Name ist erforderlich");
      if (!price || parseFloat(price) < 0) throw new Error("Preis muss positiv sein");
      if (!stock || parseInt(stock) < 0) throw new Error("Lagerbestand muss positiv sein");

      // Warte auf alle Uploads
      const pendingUploads = images.filter((img) => img.uploading);
      if (pendingUploads.length > 0) {
        throw new Error("Bitte warten Sie, bis alle Bilder hochgeladen sind");
      }

      // Daten vorbereiten
      const productData = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        previewImage: previewImage.trim() || images[0]?.url || null,
        images: images.map((img) => ({
          url: img.url,
          index: img.index,
        })),
        details: details
          .filter((d) => d.key.trim() && d.value.trim())
          .map((d) => ({ key: d.key.trim(), value: d.value.trim() })),
      };

      const url = isEditing
        ? `/api/products/${productId}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Speichern fehlgeschlagen");
      }

      setSuccess(true);

      // Nach erfolgreicher Erstellung zur Produktliste navigieren
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Lädt...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Erfolgsmeldung */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Produkt erfolgreich {isEditing ? "aktualisiert" : "erstellt"}!
        </div>
      )}

      {/* Basis-Informationen */}
      <Card>
        <CardHeader>
          <CardTitle>Basis-Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Produktname *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Premium Laptop"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detaillierte Produktbeschreibung..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preis (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.99"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock">Lagerbestand *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="previewImage">Vorschaubild URL (optional)</Label>
            <Input
              id="previewImage"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Wird automatisch das erste Bild verwendet"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bilder Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Produktbilder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Bilder hier ablegen oder klicken zum Auswählen
            </p>
            <p className="text-sm text-gray-500">
              Unterstützt: JPG, PNG, GIF, WebP (max. 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Bild-Vorschau */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative group border rounded-lg overflow-hidden bg-gray-50 cursor-move"
                  draggable
                  onDragStart={() => handleImageDragStart(index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragEnd={handleImageDragEnd}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={`Produkt ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-sm">Lädt...</div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-white drop-shadow" />
                  </div>

                  {/* Index */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produkt-Details (Key-Value) */}
      <Card>
        <CardHeader>
          <CardTitle>Produkt-Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {details.map((detail, index) => (
            <div key={detail.id} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={detail.key}
                  onChange={(e) => updateDetail(detail.id, "key", e.target.value)}
                  placeholder="z.B. Material"
                  list={`suggestions-${detail.id}`}
                />
                <datalist id={`suggestions-${detail.id}`}>
                  {DETAIL_KEY_SUGGESTIONS.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </div>
              <div className="flex-1">
                <Input
                  value={detail.value}
                  onChange={(e) => updateDetail(detail.id, "value", e.target.value)}
                  placeholder="Wert eingeben"
                />
              </div>
              {details.length > 1 && index < details.length - 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeDetail(detail.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Aktionen */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={saving}
        >
          Abbrechen
        </Button>
        <Button type="submit" disabled={saving}>
          {saving
            ? "Speichert..."
            : isEditing
            ? "Änderungen speichern"
            : "Produkt erstellen"}
        </Button>
      </div>
    </form>
  );
}
