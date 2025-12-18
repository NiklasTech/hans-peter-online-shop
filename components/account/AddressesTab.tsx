"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Trash2, Edit, Check } from "lucide-react";
import AddressDialog from "./AddressDialog";

interface Address {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phone?: string | null;
  createdAt: string;
}

interface AddressesTabProps {
  addresses: Address[];
  defaultAddressId: number | null;
  onUpdate: () => void;
}

export default function AddressesTab({ addresses, defaultAddressId, onUpdate }: AddressesTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: "PUT",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to set default address");
      }

      onUpdate();
    } catch (err: any) {
      alert(err.message || "Failed to set default address");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingId(addressId);
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete address");
      }

      onUpdate();
    } catch (err: any) {
      alert(err.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    setEditingAddress(null);
    if (shouldRefresh) {
      onUpdate();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lieferadressen</CardTitle>
              <CardDescription>Verwalte deine Lieferadressen</CardDescription>
            </div>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Adresse hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Adressen</h3>
              <p className="text-gray-600 mb-4">Füge deine erste Lieferadresse hinzu</p>
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Adresse hinzufügen
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {address.firstName} {address.lastName}
                          </h3>
                          {address.id === defaultAddressId && (
                            <Badge variant="default">Standard</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street} {address.houseNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.postalCode} {address.city}
                        </p>
                        <p className="text-sm text-gray-600">{address.countryCode}</p>
                        {address.phone && (
                          <p className="text-sm text-gray-600 mt-1">Telefon: {address.phone}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {address.id !== defaultAddressId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Als Standard
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={deletingId === address.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddressDialog
        open={dialogOpen}
        address={editingAddress}
        onClose={handleDialogClose}
      />
    </>
  );
}
