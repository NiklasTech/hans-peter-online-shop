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
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

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

interface CategoryRow {
  id: string;
  name: string;
  categoryId?: number;
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

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);
  const [brandName, setBrandName] = useState("");
  const [brandId, setBrandId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [details, setDetails] = useState<DetailRow[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Categories and Brands
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Autocomplete State
  const [categoryInputFocus, setCategoryInputFocus] = useState<string | null>(null);
  const [brandInputFocus, setBrandInputFocus] = useState(false);

  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
    if (details.length === 0) {
      setDetails([{ id: crypto.randomUUID(), key: "", value: "" }]);
    }
    if (categoryRows.length === 0) {
      setCategoryRows([{ id: crypto.randomUUID(), name: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/brands"),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }

        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setBrands(data.brands || []);
        }
      } catch (error) {
        console.error("Error fetching categories/brands:", error);
      }
    };

    fetchData();
  }, []);

  // Create new category
  const handleCreateCategory = async (name: string, rowId: string) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        const newCategory = data.category;
        setCategories((prev) => [...prev, newCategory]);

        // Update the corresponding row with the new Category-ID
        setCategoryRows((prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, name, categoryId: newCategory.id } : row
          )
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Create new brand
  const handleCreateBrand = async (name: string) => {
    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        const newBrand = data.brand;
        setBrands((prev) => [...prev, newBrand]);
        setBrandName(newBrand.name);
        setBrandId(newBrand.id);
      }
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  // Load product (for edit)
  const loadProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/product?id=${productId}`);
      if (!response.ok) throw new Error("Produkt konnte nicht geladen werden");

      const data = await response.json();
      const product: Product = data.product;

      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setStock(product.stock.toString());

      // Load categories
      if (product.categories && product.categories.length > 0) {
        const loadedCategories = product.categories.map((c: { categoryId: number; category?: { name: string } }) => ({
          id: crypto.randomUUID(),
          name: c.category?.name || "",
          categoryId: c.categoryId,
        }));
        // Add empty row
        setCategoryRows([...loadedCategories, { id: crypto.randomUUID(), name: "" }]);
      }

      // Load brand
      setBrandId(product.brandId);
      // Wait until brands are loaded, then set brandName
      const brand = brands.find(b => b.id === product.brandId);
      if (brand) {
        setBrandName(brand.name);
      }

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

      // Load details
      if (product.details && product.details.length > 0) {
        const loadedDetails = product.details.map((d: { id: number; key: string; value: string }) => ({
          id: crypto.randomUUID(),
          key: d.key,
          value: d.value,
        }));
        // Add empty row
        setDetails([...loadedDetails, { id: crypto.randomUUID(), key: "", value: "" }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  }, [productId, brands]);

  useEffect(() => {
    if (isEditing && productId) {
      loadProduct();
    }
  }, [isEditing, productId, loadProduct]);

  // Image upload
  const uploadImage = async (file: File): Promise<string> => {
    if (!productId) {
      throw new Error("Product ID is required for image upload");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId.toString());
    formData.append("id", productId.toString());

    const response = await fetch("/api/admin/product/imageUpload", {
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

  // Add files
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if productId exists
    if (!productId) {
      setError("Bitte speichern Sie das Produkt zuerst, bevor Sie Bilder hochladen.");
      return;
    }

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

      // Upload in background
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
          setError(err.message || "Fehler beim Hochladen des Bildes");
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

  // Change image order
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

    // Update indices
    newImages.forEach((img, idx) => {
      img.index = idx;
    });

    setImages(newImages);
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // Reassign indices
      return newImages.map((img, idx) => ({ ...img, index: idx }));
    });
  };

  // Manage category rows
  const updateCategoryRow = (id: string, value: string) => {
    setCategoryRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          // Search for existing category
          const existingCategory = categories.find(
            (cat) => cat.name.toLowerCase() === value.toLowerCase()
          );

          return {
            ...row,
            name: value,
            categoryId: existingCategory?.id,
          };
        }
        return row;
      })
    );

    // If last row is edited, add new row
    const rowIndex = categoryRows.findIndex((r) => r.id === id);
    if (rowIndex === categoryRows.length - 1 && value.trim() !== "") {
      setCategoryRows((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: "" },
      ]);
    }
  };

  const removeCategoryRow = (id: string) => {
    setCategoryRows((prev) => {
      const filtered = prev.filter((row) => row.id !== id);
      // Keep at least one empty row
      return filtered.length === 0
        ? [{ id: crypto.randomUUID(), name: "" }]
        : filtered;
    });
  };

  const handleCategoryBlur = async (id: string, value: string) => {
    if (!value.trim()) return;

    const row = categoryRows.find((r) => r.id === id);
    if (!row?.categoryId) {
      // Category doesn't exist, create it
      await handleCreateCategory(value.trim(), id);
    }
  };

  // Brand Input Handler
  const handleBrandChange = (value: string) => {
    setBrandName(value);

    // Search for existing brand
    const existingBrand = brands.find(
      (b) => b.name.toLowerCase() === value.toLowerCase()
    );

    if (existingBrand) {
      setBrandId(existingBrand.id);
    } else {
      setBrandId(null);
    }
  };

  const handleBrandBlur = async () => {
    if (!brandName.trim()) return;

    if (!brandId) {
      // Brand doesn't exist, create it
      await handleCreateBrand(brandName.trim());
    }
  };

  const getBrandSuggestions = () => {
    if (!brandName) return brands;
    return brands.filter((b) =>
      b.name.toLowerCase().includes(brandName.toLowerCase())
    );
  };

  const getCategorySuggestions = (inputValue: string) => {
    if (!inputValue) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Manage detail rows
  const updateDetail = (id: string, field: "key" | "value", value: string) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );

    // If last row is edited, add new row
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
      // Keep at least one empty row
      return filtered.length === 0
        ? [{ id: crypto.randomUUID(), key: "", value: "" }]
        : filtered;
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!name.trim()) throw new Error("Name ist erforderlich");
      if (!price || parseFloat(price) < 0) throw new Error("Preis muss positiv sein");
      if (!stock || parseInt(stock) < 0) throw new Error("Lagerbestand muss positiv sein");

      const validCategories = categoryRows.filter((row) => row.name.trim() && row.categoryId);
      if (validCategories.length === 0) throw new Error("Mindestens eine Kategorie ist erforderlich");

      if (!brandId) throw new Error("Marke ist erforderlich");

      // Wait for all uploads
      const pendingUploads = images.filter((img) => img.uploading);
      if (pendingUploads.length > 0) {
        throw new Error("Bitte warten Sie, bis alle Bilder hochgeladen sind");
      }

      // Prepare data
      const productData = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryIds: validCategories.map((row) => row.categoryId!),
        brandId: brandId,
        previewImage: previewImage.trim() || images[0]?.url || null,
        images: images.map((img) => ({
          url: img.url,
          index: img.index,
        })),
        details: details
          .filter((d) => d.key.trim() && d.value.trim())
          .map((d) => ({ key: d.key.trim(), value: d.value.trim() })),
      };

      const url = "/api/admin/product";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: productId, ...productData } : productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Speichern fehlgeschlagen");
      }

      const result = await response.json();
      setSuccess(true);

      // After successful creation, redirect to product detail page
      setTimeout(() => {
        // For new product, redirect to edit page of created product
        router.push(`/admin/product/${result.product.id}`);
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
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Produkt erfolgreich {isEditing ? "aktualisiert" : "erstellt"}!
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basis-Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="m-1">Produktname *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Premium Laptop"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="m-1">Beschreibung</Label>
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
              <Label htmlFor="price" className="m-1">Preis (€) *</Label>
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
              <Label htmlFor="stock" className="m-1">Lagerbestand *</Label>
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
            <Label htmlFor="brand" className="m-1">Marke *</Label>
            <div className="relative">
              <Input
                id="brand"
                value={brandName}
                onChange={(e) => handleBrandChange(e.target.value)}
                onFocus={() => setBrandInputFocus(true)}
                onBlur={() => {
                  setTimeout(() => setBrandInputFocus(false), 200);
                  handleBrandBlur();
                }}
                placeholder="Marke eingeben oder auswählen"
                list="brand-suggestions"
                required
              />
              {brandInputFocus && getBrandSuggestions().length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {getBrandSuggestions().map((brand) => (
                    <div
                      key={brand.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setBrandName(brand.name);
                        setBrandId(brand.id);
                        setBrandInputFocus(false);
                      }}
                    >
                      {brand.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label className="m-1">Kategorien *</Label>
            <div className="space-y-2">
              {isClient && categoryRows.map((row, index) => (
                <div key={row.id} className="flex gap-2 relative">
                  <div className="flex-1 relative">
                    <Input
                      value={row.name}
                      onChange={(e) => updateCategoryRow(row.id, e.target.value)}
                      onFocus={() => setCategoryInputFocus(row.id)}
                      onBlur={() => {
                        setTimeout(() => setCategoryInputFocus(null), 200);
                        handleCategoryBlur(row.id, row.name);
                      }}
                      placeholder="Kategorie eingeben"
                    />
                    {categoryInputFocus === row.id && getCategorySuggestions(row.name).length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {getCategorySuggestions(row.name).map((category) => (
                          <div
                            key={category.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => {
                              updateCategoryRow(row.id, category.name);
                              setCategoryInputFocus(null);
                            }}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {categoryRows.length > 1 && index < categoryRows.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeCategoryRow(row.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="previewImage" className="m-1">Vorschaubild URL (optional)</Label>
            <Input
              id="previewImage"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Wird automatisch das erste Bild verwendet"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Produktbilder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Note when no productId */}
          {!productId && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Hinweis</p>
              <p className="text-sm">
                Bitte speichern Sie das Produkt zuerst, bevor Sie Bilder hochladen können.
              </p>
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              !productId
                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                : dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 cursor-pointer"
            }`}
            onDragEnter={productId ? handleDrag : undefined}
            onDragLeave={productId ? handleDrag : undefined}
            onDragOver={productId ? handleDrag : undefined}
            onDrop={productId ? handleDrop : undefined}
            onClick={productId ? () => fileInputRef.current?.click() : undefined}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${productId ? "text-gray-400" : "text-gray-300"}`} />
            <p className="text-lg font-medium mb-2">
              {productId
                ? "Bilder hier ablegen oder klicken zum Auswählen"
                : "Produkt muss zuerst gespeichert werden"
              }
            </p>
            <p className="text-sm text-gray-500">
              {productId ? "max. 50MiB" : ""}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              disabled={!productId}
            />
          </div>

          {/* Image Preview */}
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

      {/* Product Details (Key-Value) */}
      <Card>
        <CardHeader>
          <CardTitle>Produkt-Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isClient && details.map((detail, index) => (
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

      {/* Actions */}
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
