"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Mail, Lock, Calendar, User, Building2, Hash } from "lucide-react";

interface PaymentFormProps {
  paymentMethod: string;
  onFormDataChange: (data: Record<string, string>, isValid: boolean) => void;
}

// German banks for Sofort/Giropay/iDEAL
const GERMAN_BANKS = [
  { id: "sparkasse", name: "Sparkasse" },
  { id: "volksbank", name: "Volksbank" },
  { id: "commerzbank", name: "Commerzbank" },
  { id: "deutsche_bank", name: "Deutsche Bank" },
  { id: "postbank", name: "Postbank" },
  { id: "ing", name: "ING" },
  { id: "dkb", name: "DKB" },
  { id: "comdirect", name: "comdirect" },
  { id: "n26", name: "N26" },
  { id: "hypovereinsbank", name: "HypoVereinsbank" },
];

// Format credit card number with spaces
const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  return parts.length ? parts.join(" ") : value;
};

// Format expiry date
const formatExpiry = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
};

// Format IBAN
const formatIBAN = (value: string) => {
  const v = value.replace(/\s+/g, "").toUpperCase();
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substring(i, i + 4));
  }
  return parts.join(" ");
};

// Validate email
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate IBAN (simplified - just check format)
const isValidIBAN = (iban: string) => {
  const cleaned = iban.replace(/\s/g, "");
  return cleaned.length >= 15 && cleaned.length <= 34 && /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned);
};

// Validate card number (Luhn algorithm simplified)
const isValidCardNumber = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s/g, "");
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

// Validate expiry
const isValidExpiry = (expiry: string) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1]);
  const year = parseInt("20" + match[2]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return month >= 1 && month <= 12 && (year > currentYear || (year === currentYear && month >= currentMonth));
};

// Validate CVV
const isValidCVV = (cvv: string) => {
  return /^\d{3,4}$/.test(cvv);
};

// Validate birthdate
const isValidBirthdate = (date: string) => {
  const match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;
  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);
  const birthDate = new Date(year, month - 1, day);
  const now = new Date();
  const age = now.getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 120;
};

export function PaymentForm({ paymentMethod, onFormDataChange }: PaymentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear error when typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }

    // Validate and notify parent
    const isValid = validateForm(paymentMethod, newFormData);
    onFormDataChange(newFormData, isValid);
  };

  const validateForm = (method: string, data: Record<string, string>): boolean => {
    switch (method) {
      case "paypal":
        return isValidEmail(data.email || "") && (data.password || "").length >= 6;
      case "credit_card":
        return (
          isValidCardNumber(data.cardNumber || "") &&
          (data.cardHolder || "").length >= 3 &&
          isValidExpiry(data.expiry || "") &&
          isValidCVV(data.cvv || "")
        );
      case "klarna":
        return isValidEmail(data.email || "") && isValidBirthdate(data.birthdate || "");
      case "sepa":
        return isValidIBAN(data.iban || "") && (data.accountHolder || "").length >= 3;
      case "sofort":
      case "giropay":
      case "ideal":
        return (data.bank || "").length > 0;
      case "apple_pay":
      case "google_pay":
        return true; // No form needed
      default:
        return false;
    }
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email":
        return isValidEmail(value) ? "" : "Bitte gib eine gültige E-Mail-Adresse ein";
      case "password":
        return value.length >= 6 ? "" : "Passwort muss mindestens 6 Zeichen haben";
      case "cardNumber":
        return isValidCardNumber(value) ? "" : "Bitte gib eine gültige Kartennummer ein";
      case "cardHolder":
        return value.length >= 3 ? "" : "Bitte gib den Namen auf der Karte ein";
      case "expiry":
        return isValidExpiry(value) ? "" : "Ungültiges Ablaufdatum (MM/YY)";
      case "cvv":
        return isValidCVV(value) ? "" : "CVV muss 3-4 Ziffern haben";
      case "iban":
        return isValidIBAN(value) ? "" : "Bitte gib eine gültige IBAN ein";
      case "accountHolder":
        return value.length >= 3 ? "" : "Bitte gib den Kontoinhaber ein";
      case "birthdate":
        return isValidBirthdate(value) ? "" : "Ungültiges Datum (TT.MM.JJJJ, mind. 18 Jahre)";
      case "bank":
        return value.length > 0 ? "" : "Bitte wähle deine Bank aus";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field] || "";
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error });
  };

  // Render different forms based on payment method
  switch (paymentMethod) {
    case "paypal":
      return (
        <div className="space-y-4 mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-center text-sm text-blue-700 dark:text-blue-300 mb-4">
            Melde dich bei PayPal an, um die Zahlung abzuschließen
          </div>
          <div className="space-y-2">
            <Label htmlFor="paypal-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Mail-Adresse
            </Label>
            <Input
              id="paypal-email"
              type="email"
              placeholder="beispiel@email.de"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="paypal-password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Passwort
            </Label>
            <Input
              id="paypal-password"
              type="password"
              placeholder="••••••••"
              value={formData.password || ""}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
        </div>
      );

    case "credit_card":
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <Label htmlFor="card-number" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Kartennummer
            </Label>
            <Input
              id="card-number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber || ""}
              onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
              onBlur={() => handleBlur("cardNumber")}
              maxLength={19}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-holder" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Name auf der Karte
            </Label>
            <Input
              id="card-holder"
              type="text"
              placeholder="Max Mustermann"
              value={formData.cardHolder || ""}
              onChange={(e) => updateField("cardHolder", e.target.value)}
              onBlur={() => handleBlur("cardHolder")}
              className={errors.cardHolder ? "border-red-500" : ""}
            />
            {errors.cardHolder && <p className="text-xs text-red-500">{errors.cardHolder}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-expiry" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Gültig bis
              </Label>
              <Input
                id="card-expiry"
                type="text"
                placeholder="MM/YY"
                value={formData.expiry || ""}
                onChange={(e) => updateField("expiry", formatExpiry(e.target.value))}
                onBlur={() => handleBlur("expiry")}
                maxLength={5}
                className={errors.expiry ? "border-red-500" : ""}
              />
              {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvv" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                CVV
              </Label>
              <Input
                id="card-cvv"
                type="text"
                placeholder="123"
                value={formData.cvv || ""}
                onChange={(e) => updateField("cvv", e.target.value.replace(/\D/g, ""))}
                onBlur={() => handleBlur("cvv")}
                maxLength={4}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      );

    case "klarna":
      return (
        <div className="space-y-4 mt-4 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-800">
          <div className="text-center text-sm text-pink-700 dark:text-pink-300 mb-4">
            Kaufe jetzt, zahle später mit Klarna
          </div>
          <div className="space-y-2">
            <Label htmlFor="klarna-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Mail-Adresse
            </Label>
            <Input
              id="klarna-email"
              type="email"
              placeholder="beispiel@email.de"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="klarna-birthdate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Geburtsdatum
            </Label>
            <Input
              id="klarna-birthdate"
              type="text"
              placeholder="TT.MM.JJJJ"
              value={formData.birthdate || ""}
              onChange={(e) => {
                let v = e.target.value.replace(/[^\d.]/g, "");
                // Auto-add dots
                if (v.length === 2 && !v.includes(".")) v += ".";
                if (v.length === 5 && v.split(".").length === 2) v += ".";
                updateField("birthdate", v);
              }}
              onBlur={() => handleBlur("birthdate")}
              maxLength={10}
              className={errors.birthdate ? "border-red-500" : ""}
            />
            {errors.birthdate && <p className="text-xs text-red-500">{errors.birthdate}</p>}
          </div>
        </div>
      );

    case "sepa":
      return (
        <div className="space-y-4 mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-center text-sm text-blue-700 dark:text-blue-300 mb-4">
            Zahle bequem per Lastschrift
          </div>
          <div className="space-y-2">
            <Label htmlFor="sepa-iban" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              IBAN
            </Label>
            <Input
              id="sepa-iban"
              type="text"
              placeholder="DE89 3704 0044 0532 0130 00"
              value={formData.iban || ""}
              onChange={(e) => updateField("iban", formatIBAN(e.target.value))}
              onBlur={() => handleBlur("iban")}
              className={errors.iban ? "border-red-500" : ""}
            />
            {errors.iban && <p className="text-xs text-red-500">{errors.iban}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sepa-holder" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Kontoinhaber
            </Label>
            <Input
              id="sepa-holder"
              type="text"
              placeholder="Max Mustermann"
              value={formData.accountHolder || ""}
              onChange={(e) => updateField("accountHolder", e.target.value)}
              onBlur={() => handleBlur("accountHolder")}
              className={errors.accountHolder ? "border-red-500" : ""}
            />
            {errors.accountHolder && <p className="text-xs text-red-500">{errors.accountHolder}</p>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mit der Eingabe deiner IBAN erteilst du uns ein SEPA-Lastschriftmandat.
          </p>
        </div>
      );

    case "sofort":
    case "giropay":
    case "ideal":
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-700 dark:text-gray-300 mb-4">
            Wähle deine Bank für die Überweisung
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-select" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Deine Bank
            </Label>
            <Select
              value={formData.bank || ""}
              onValueChange={(value) => updateField("bank", value)}
            >
              <SelectTrigger className={errors.bank ? "border-red-500" : ""}>
                <SelectValue placeholder="Bank auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {GERMAN_BANKS.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank && <p className="text-xs text-red-500">{errors.bank}</p>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Du wirst nach der Bestellung zu deiner Bank weitergeleitet.
          </p>
        </div>
      );

    case "apple_pay":
      return (
        <div className="mt-4 p-6 bg-gray-900 dark:bg-gray-950 rounded-lg border border-gray-700 text-center">
          <div className="text-white text-lg mb-2">Apple Pay</div>
          <p className="text-gray-400 text-sm mb-4">
            Bestätige die Zahlung mit Face ID oder Touch ID
          </p>
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="black"/>
              <path d="M21 9H15V22H13V16H11V22H9V9H3V7H21V9Z" fill="black"/>
            </svg>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            Die Zahlung wird bei Bestellabschluss automatisch bestätigt
          </p>
        </div>
      );

    case "google_pay":
      return (
        <div className="mt-4 p-6 bg-white dark:bg-gray-100 rounded-lg border border-gray-200 text-center">
          <div className="text-gray-900 text-lg mb-2">Google Pay</div>
          <p className="text-gray-600 text-sm mb-4">
            Zahle schnell und sicher mit Google Pay
          </p>
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            Die Zahlung wird bei Bestellabschluss automatisch bestätigt
          </p>
        </div>
      );

    default:
      return null;
  }
}
