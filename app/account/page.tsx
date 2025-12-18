"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Settings, Package, Heart } from "lucide-react";
import ProfileTab from "@/components/account/ProfileTab";
import AddressesTab from "@/components/account/AddressesTab";
import SettingsTab from "@/components/account/SettingsTab";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  defaultAddressId: number | null;
  defaultSupplier: string | null;
  defaultPayment: string | null;
  defaultAddress: any | null;
  addresses: any[];
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchCounts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");

      if (response.status === 401) {
        router.push("/?login=true");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      // Fetch orders count
      const ordersRes = await fetch("/api/user/orders");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrdersCount(ordersData.orders?.length || 0);
      }

      // Fetch wishlist count
      const wishlistRes = await fetch("/api/wishlist/count");
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlistCount(wishlistData.count || 0);
      }
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  const handleProfileUpdate = () => {
    fetchUserProfile();
    fetchCounts();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade dein Konto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || "Profil konnte nicht geladen werden"}</p>
              <Button onClick={fetchUserProfile}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mein Konto</h1>
          <p className="text-gray-600">Verwalte dein Profil, Adressen und Einstellungen</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/orders")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bestellungen</p>
                  <p className="text-xl font-bold">{ordersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/wishlist")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wunschliste</p>
                  <p className="text-xl font-bold">{wishlistCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adressen</p>
                  <p className="text-xl font-bold">{user.addresses?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mitglied seit</p>
                  <p className="text-sm font-semibold">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Adressen</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Einstellungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab user={user} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesTab
              addresses={user.addresses || []}
              defaultAddressId={user.defaultAddressId}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} onUpdate={handleProfileUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
