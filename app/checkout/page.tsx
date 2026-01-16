"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { PAYMENT_METHODS, PaymentModal } from "@/components/payment";

interface CartItem {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    salePrice?: number | null;
    previewImage: string | null;
    stock: number;
    brand: {
      name: string;
    };
  };
}

interface Address {
  id: number;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("paypal");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      setIsLoading(true);

      // Fetch cart items
      const cartResponse = await fetch("/api/cart");
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData.cartItems || []);
      } else if (cartResponse.status === 401) {
        router.push("/?login=true");
        return;
      }

      // Fetch addresses
      const addressResponse = await fetch("/api/user/addresses");
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData.addresses || []);

        // Auto-select first address or default address
        const defaultAddress = addressData.addresses?.find((addr: Address & { isDefault?: boolean }) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addressData.addresses?.length > 0) {
          setSelectedAddressId(addressData.addresses[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching checkout data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItemId(productId);
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const openPaymentModal = () => {
    if (!selectedAddressId) {
      alert("Bitte wähle eine Lieferadresse aus");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    setShowPaymentModal(false);
    setIsPlacingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Clear cart event
        window.dispatchEvent(new CustomEvent("cart-updated"));
        // Redirect to order confirmation
        router.push(`/orders/${data.order.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Fehler beim Erstellen der Bestellung");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Ein Fehler ist aufgetreten");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getEffectivePrice = (product: CartItem["product"]) => {
    return product.salePrice !== null && product.salePrice !== undefined
      ? product.salePrice
      : product.price;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0);
  };

  const calculateShipping = () => {
    const total = calculateTotal();
    return total > 50 ? 0 : 4.99; // Free shipping over €50
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateShipping();
  };

  const canProceedToStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case 2:
        return cartItems.length > 0;
      case 3:
        return cartItems.length > 0 && selectedAddressId !== null;
      case 4:
        return cartItems.length > 0 && selectedAddressId !== null && selectedPaymentMethod !== "";
      default:
        return true;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Lade Checkout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Dein Warenkorb ist leer</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Füge Produkte hinzu, um mit dem Checkout fortzufahren.
                </p>
                <Link href="/">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Weiter einkaufen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Shop
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-full h-1 mx-2 transition-colors ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    style={{ width: "80px" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-2xl mx-auto mt-2">
            <span className={`text-xs ${currentStep >= 1 ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
              Warenkorb
            </span>
            <span className={`text-xs ${currentStep >= 2 ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
              Lieferadresse
            </span>
            <span className={`text-xs ${currentStep >= 3 ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
              Zahlung
            </span>
            <span className={`text-xs ${currentStep >= 4 ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
              Übersicht
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Warenkorb ({cartItems.length} {cartItems.length === 1 ? "Artikel" : "Artikel"})
                  </CardTitle>
                  <CardDescription>Überprüfe deine Artikel vor dem Checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded bg-gray-200 dark:bg-slate-700 shrink-0 overflow-hidden">
                        {item.product.previewImage ? (
                          <img
                            src={item.product.previewImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.brand.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {item.product.salePrice !== null && item.product.salePrice !== undefined ? (
                            <>
                              <p className="text-lg font-bold text-red-600 dark:text-red-500">
                                {formatPrice(item.product.salePrice)}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.price)}
                              </p>
                              <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">
                                -{Math.round((1 - item.product.salePrice / item.product.price) * 100)}%
                              </span>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatPrice(item.product.price)}
                            </p>
                          )}
                        </div>
                        {item.product.stock < 5 && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            Nur noch {item.product.stock} auf Lager
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItemId === item.productId}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || updatingItemId === item.productId}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Entfernen
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Address */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Lieferadresse
                  </CardTitle>
                  <CardDescription>Wähle eine Lieferadresse für deine Bestellung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length > 0 ? (
                    <RadioGroup value={selectedAddressId?.toString()} onValueChange={(val) => setSelectedAddressId(parseInt(val))}>
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                          <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
                          <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-semibold">
                                {address.street} {address.houseNumber}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.postalCode} {address.city}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{address.country}</p>
                              {address.phone && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tel: {address.phone}</p>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Du hast noch keine Adresse gespeichert
                      </p>
                      <Link href="/account?tab=addresses">
                        <Button>Adresse hinzufügen</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Zahlungsmethode
                  </CardTitle>
                  <CardDescription>Wähle deine bevorzugte Zahlungsmethode</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                            : "hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                        <Label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex-1">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {method.description}
                              </div>
                            </div>
                            <div className="shrink-0 ml-4">
                              <method.Logo />
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Order Summary */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Bestellübersicht
                  </CardTitle>
                  <CardDescription>Überprüfe deine Bestellung vor dem Absenden</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cart Items Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Artikel ({cartItems.length})</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => {
                        const effectivePrice = getEffectivePrice(item.product);
                        const isOnSale = item.product.salePrice !== null && item.product.salePrice !== undefined;
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {item.quantity}x {item.product.name}
                              {isOnSale && (
                                <span className="ml-1 text-red-600 dark:text-red-400 text-xs">
                                  (-{Math.round((1 - item.product.salePrice! / item.product.price) * 100)}%)
                                </span>
                              )}
                            </span>
                            <span className={`font-semibold ${isOnSale ? "text-red-600 dark:text-red-500" : ""}`}>
                              {formatPrice(effectivePrice * item.quantity)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Address Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Lieferadresse</h3>
                    {selectedAddressId && addresses.find((a) => a.id === selectedAddressId) && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {(() => {
                          const addr = addresses.find((a) => a.id === selectedAddressId)!;
                          return (
                            <>
                              <p>
                                {addr.street} {addr.houseNumber}
                              </p>
                              <p>
                                {addr.postalCode} {addr.city}
                              </p>
                              <p>{addr.country}</p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Payment Method Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Zahlungsmethode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Bestellübersicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Zwischensumme</span>
                    <span className="font-semibold">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Versand</span>
                    <span className="font-semibold">
                      {calculateShipping() === 0 ? "Kostenlos" : formatPrice(calculateShipping())}
                    </span>
                  </div>
                  {calculateShipping() > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Versandkostenfrei ab €50
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span>{formatPrice(calculateFinalTotal())}</span>
                  </div>
                </div>

                <Separator />

                {/* Navigation Buttons */}
                <div className="space-y-2">
                  {currentStep < 4 ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => setCurrentStep((prev) => (prev + 1) as CheckoutStep)}
                        disabled={!canProceedToStep((currentStep + 1) as CheckoutStep)}
                      >
                        Weiter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      {currentStep > 1 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setCurrentStep((prev) => (prev - 1) as CheckoutStep)}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Zurück
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={openPaymentModal}
                        disabled={isPlacingOrder}
                      >
                        {isPlacingOrder ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Bestellung wird erstellt...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Jetzt bezahlen
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCurrentStep(3)}
                        disabled={isPlacingOrder}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zurück
                      </Button>
                    </>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Sichere Zahlung</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>14 Tage Rückgaberecht</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Kostenloser Versand ab €50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        paymentMethod={selectedPaymentMethod}
        total={formatPrice(calculateFinalTotal())}
        onComplete={handlePaymentComplete}
        onCancel={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
