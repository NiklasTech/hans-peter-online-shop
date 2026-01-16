"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, CreditCard, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SettingsTabProps {
  user: {
    id: number;
    defaultSupplier: string | null;
    defaultPayment: string | null;
  };
  onUpdate: () => void;
}

export default function SettingsTab({ user, onUpdate }: SettingsTabProps) {
  const [passwordSection, setPasswordSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    defaultSupplier: user.defaultSupplier || "",
    defaultPayment: user.defaultPayment || "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Das neue Passwort muss mindestens 6 Zeichen lang sein");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess("Passwort erfolgreich geändert!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSection(false);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Einstellungen konnten nicht aktualisiert werden"
        );
      }

      setSuccess("Einstellungen erfolgreich aktualisiert!");
      onUpdate();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "ACCOUNT LÖSCHEN") {
      setDeleteError("Bitte gib 'ACCOUNT LÖSCHEN' ein, um fortzufahren");
      return;
    }

    if (!deletePassword) {
      setDeleteError("Bitte gib dein Passwort ein");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: deletePassword,
          confirmText: deleteConfirmText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Account konnte nicht gelöscht werden");
      }

      // Redirect to home page after successful deletion
      window.location.href = "/";
    } catch (err: Error | unknown) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle>Passwort & Sicherheit</CardTitle>
              <CardDescription>
                Aktualisiere dein Passwort um dein Konto zu schützen
              </CardDescription>
            </div>
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

          {!passwordSection ? (
            <Button onClick={() => setPasswordSection(true)}>
              Passwort ändern
            </Button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Neues Passwort bestätigen
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Aktualisieren..." : "Passwort aktualisieren"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordSection(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setError(null);
                  }}
                >
                  Abbrechen
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Einkaufspräferenzen</CardTitle>
              <CardDescription>
                Lege deine Standard-Zahlungs- und Versandmethoden fest
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultPayment">Standard-Zahlungsmethode</Label>
            <Select
              value={preferences.defaultPayment}
              onValueChange={(value) =>
                setPreferences({ ...preferences, defaultPayment: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Zahlungsmethode wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Kreditkarte</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank-transfer">Banküberweisung</SelectItem>
                <SelectItem value="cash-on-delivery">Nachnahme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultSupplier">
              Standard-Versanddienstleister
            </Label>
            <Select
              value={preferences.defaultSupplier}
              onValueChange={(value) =>
                setPreferences({ ...preferences, defaultSupplier: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Versanddienstleister wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="ups">UPS</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
                <SelectItem value="hermes">Hermes</SelectItem>
                <SelectItem value="dpd">DPD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePreferencesUpdate} disabled={loading}>
            {loading ? "Speichern..." : "Einstellungen speichern"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-600">Gefahrenzone</CardTitle>
              <CardDescription>Account dauerhaft löschen</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">
                  Achtung: Diese Aktion kann nicht rückgängig gemacht werden!
                </p>
                <p>
                  Wenn du deinen Account löschst, werden alle deine Daten
                  permanent entfernt, einschließlich:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Profilinformationen</li>
                  <li>Bestellhistorie</li>
                  <li>Wunschliste</li>
                  <li>Gespeicherte Adressen</li>
                  <li>Alle persönlichen Einstellungen</li>
                </ul>
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Account löschen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Account wirklich löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine
              Daten werden permanent gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {deleteError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deletePassword">Passwort zur Bestätigung</Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder="Dein Passwort"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deleting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">
                Gib <span className="font-bold">ACCOUNT LÖSCHEN</span> ein, um
                zu bestätigen
              </Label>
              <Input
                id="deleteConfirm"
                placeholder="ACCOUNT LÖSCHEN"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deleting}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Abbrechen</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={
                deleting ||
                !deletePassword ||
                deleteConfirmText !== "ACCOUNT LÖSCHEN"
              }
            >
              {deleting ? "Wird gelöscht..." : "Endgültig löschen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
