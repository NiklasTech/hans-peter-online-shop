"use client";

/**
 * Admin Brands List Page
 * Route: /admin/brands
 *
 * Displays all brands with options to view, edit, and delete
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Brand type
interface Brand {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    products: number;
  };
}

export default function BrandsListPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/brands");
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Marken");
      }

      const data = await response.json();
      setBrands(data.brands || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/admin/brands?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen der Marke");
      }

      // Remove from list
      setBrands(brands.filter((brand) => brand.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setDeleting(null);
    }
  };

  // Filter brands by search term
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Lädt Marken...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Markenverwaltung</h1>
        <Button onClick={() => router.push("/admin/brand")}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Marke
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Alle Marken ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Marken suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bild</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Produkte</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      {searchTerm ? "Keine Marken gefunden" : "Noch keine Marken vorhanden"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/admin/brand/${brand.id}`)}>
                        {brand.image ? (
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={brand.image}
                              alt={brand.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/admin/brand/${brand.id}`)}>
                        {brand.name}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/admin/brand/${brand.id}`)}>
                        {brand.description ? (
                          <span className="text-sm text-gray-600">
                            {brand.description.length > 60
                              ? `${brand.description.substring(0, 60)}...`
                              : brand.description}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {brand._count?.products || 0} Produkt(e)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(brand.createdAt).toLocaleDateString("de-DE")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="cursor-pointer">
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Menü öffnen</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/brand/${brand.id}`)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault();
                                handleDelete(brand.id);
                              }}
                              disabled={deleting === brand.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleting === brand.id
                                ? "Wird gelöscht..."
                                : deleteConfirm === brand.id
                                ? "Wirklich Löschen?"
                                : "Löschen"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

