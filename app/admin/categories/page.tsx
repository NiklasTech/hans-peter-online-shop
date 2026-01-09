"use client";

/**
 * Admin Categories List Page
 * Route: /admin/categories
 *
 * Displays all categories with options to view, edit, and delete
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

// Category type
interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  parentId?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  parent?: {
    id: number;
    name: string;
  } | null;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export default function CategoriesListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Kategorien");
      }

      const data = await response.json();
      setCategories(data.categories || []);
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
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Löschen der Kategorie");
      }

      // Remove from list
      setCategories(categories.filter((category) => category.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setDeleting(null);
    }
  };

  // Filter categories by search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Organize categories hierarchically
  type CategoryWithLevel = Category & { level: number };

  const organizeHierarchically = (cats: Category[]): CategoryWithLevel[] => {
    const result: CategoryWithLevel[] = [];
    const parentMap = new Map<number, Category[]>();

    // Group by parent
    cats.forEach((cat) => {
      const parentId = cat.parentId || 0;
      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, []);
      }
      parentMap.get(parentId)!.push(cat);
    });

    // Recursive function to add categories and their children
    const addCategory = (category: Category, level: number = 0) => {
      result.push({ ...category, level });
      const children = parentMap.get(category.id) || [];
      children.forEach((child) => addCategory(child, level + 1));
    };

    // Add root categories first
    const rootCategories = parentMap.get(0) || [];
    rootCategories.forEach((cat) => addCategory(cat, 0));

    return result;
  };

  const hierarchicalCategories = organizeHierarchically(filteredCategories);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Lädt Kategorien...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kategorieverwaltung</h1>
        <Button onClick={() => router.push("/admin/category")}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Kategorie
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Alle Kategorien ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Kategorien suchen..."
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
                  <TableHead>Überkategorie</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Produkte</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchicalCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      {searchTerm ? "Keine Kategorien gefunden" : "Noch keine Kategorien vorhanden"}
                    </TableCell>
                  </TableRow>
                ) : (
                  hierarchicalCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/admin/category/${category.id}`)}>
                        {category.image ? (
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={category.image}
                              alt={category.name}
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
                      <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/admin/category/${category.id}`)}>
                        <div style={{ paddingLeft: `${category.level * 20}px` }} className="flex items-center gap-2">
                          {category.level > 0 && (
                            <span className="text-gray-400">↳</span>
                          )}
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.parent ? (
                          <Badge variant="outline">{category.parent.name}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Hauptkategorie</span>
                        )}
                      </TableCell>
                      <TableCell className="cursor-pointer" onClick={() => router.push(`/admin/category/${category.id}`)}>
                        {category.description ? (
                          <span className="text-sm text-gray-600">
                            {category.description.length > 60
                              ? `${category.description.substring(0, 60)}...`
                              : category.description}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {category._count?.products || 0} Produkt(e)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString("de-DE")}
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
                              onClick={() => router.push(`/admin/category/${category.id}`)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault();
                                handleDelete(category.id);
                              }}
                              disabled={deleting === category.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleting === category.id
                                ? "Wird gelöscht..."
                                : deleteConfirm === category.id
                                ? "Nochmals klicken zum Bestätigen"
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

