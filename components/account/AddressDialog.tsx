"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
}

interface AddressDialogProps {
  open: boolean;
  address?: Address | null;
  onClose: (shouldRefresh: boolean) => void;
}

export default function AddressDialog({
  open,
  address,
  onClose,
}: AddressDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    houseNumber: "",
    city: "",
    postalCode: "",
    countryCode: "DE",
    phone: "",
    setAsDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        houseNumber: address.houseNumber,
        city: address.city,
        postalCode: address.postalCode,
        countryCode: address.countryCode,
        phone: address.phone || "",
        setAsDefault: false,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        street: "",
        houseNumber: "",
        city: "",
        postalCode: "",
        countryCode: "DE",
        phone: "",
        setAsDefault: false,
      });
    }
    setError(null);
  }, [address, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = address
        ? `/api/user/addresses/${address.id}`
        : "/api/user/addresses";
      const method = address ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      onClose(true);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {address ? "Adresse bearbeiten" : "Neue Adresse anlegen"}
          </DialogTitle>
          <DialogDescription>
            {address
              ? "Ändern Sie die Details Ihrer Versandadresse."
              : "Fügen Sie eine neue Versandadresse hinzu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Straße *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseNumber">Hausnummer. *</Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, houseNumber: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">PLZ *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">Stadt *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryCode">Land *</Label>
            <Input
              id="countryCode"
              value={formData.countryCode}
              onChange={(e) =>
                setFormData({ ...formData, countryCode: e.target.value })
              }
              placeholder="e.g., DE, US, UK"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Handynummer (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {!address && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="setAsDefault"
                checked={formData.setAsDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, setAsDefault: checked as boolean })
                }
              />
              <Label htmlFor="setAsDefault" className="cursor-pointer">
                Als Standardadresse festlegen
              </Label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? "Speichern..."
                : address
                ? "Addresse aktualisieren"
                : "Adresse hinzufügen"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
