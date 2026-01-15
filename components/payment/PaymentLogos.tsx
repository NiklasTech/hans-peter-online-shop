// Payment provider logos using official Wikipedia/Wikimedia SVG URLs
// These are the official logos loaded directly from Wikimedia Commons

export const PayPalLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
    alt="PayPal"
    className={className}
  />
);

export const VisaLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
    alt="Visa"
    className={className}
  />
);

export const MastercardLogo = ({
  className = "h-8",
}: {
  className?: string;
}) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
    alt="Mastercard"
    className={className}
  />
);

export const AmexLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
    alt="American Express"
    className={className}
  />
);

export const KlarnaLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg"
    alt="Klarna"
    className={className}
  />
);

export const SepaLogo = ({ className = "h-8" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Single_Euro_Payments_Area_logo.svg"
    alt="SEPA"
    className={className}
  />
);

export const SofortLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Sofort%C3%BCberweisung_Logo.svg"
    alt="Sofortüberweisung"
    className={className}
  />
);

export const ApplePayLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
    alt="Apple Pay"
    className={className}
  />
);

export const GooglePayLogo = ({
  className = "h-6",
}: {
  className?: string;
}) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
    alt="Google Pay"
    className={className}
  />
);

export const GiropayLogo = ({ className = "h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Giropay_Logo.svg"
    alt="Giropay"
    className={className}
  />
);

export const IdealLogo = ({ className = "h-8" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/a/ad/IDEAL_%28Bezahlsystem%29_logo.svg"
    alt="iDEAL"
    className={className}
  />
);

// Combined credit card logos component
export const CreditCardLogos = ({
  className = "h-6",
}: {
  className?: string;
}) => (
  <div className="flex items-center gap-2">
    <VisaLogo className={className} />
    <MastercardLogo className={className} />
    <AmexLogo className={className} />
  </div>
);

// Payment method configuration with logos and forms
export const PAYMENT_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    Logo: PayPalLogo,
    description: "Schnell und sicher bezahlen",
    formFields: ["email", "password"],
  },
  {
    id: "credit_card",
    name: "Kredit-/Debitkarte",
    Logo: CreditCardLogos,
    description: "Visa, Mastercard, American Express",
    formFields: ["cardNumber", "cardHolder", "expiry", "cvv"],
  },
  {
    id: "klarna",
    name: "Klarna",
    Logo: KlarnaLogo,
    description: "Rechnung oder Ratenzahlung",
    formFields: ["email", "birthdate"],
  },
  {
    id: "sepa",
    name: "SEPA Lastschrift",
    Logo: SepaLogo,
    description: "Direkt von deinem Bankkonto",
    formFields: ["iban", "accountHolder"],
  },
  {
    id: "sofort",
    name: "Sofortüberweisung",
    Logo: SofortLogo,
    description: "Online-Banking Überweisung",
    formFields: ["bank"],
  },
  {
    id: "giropay",
    name: "Giropay",
    Logo: GiropayLogo,
    description: "Direkt mit deinem Girokonto",
    formFields: ["bank"],
  },
  {
    id: "ideal",
    name: "iDEAL",
    Logo: IdealLogo,
    description: "Beliebte Zahlungsmethode in NL",
    formFields: ["bank"],
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    Logo: ApplePayLogo,
    description: "Schnell mit Face ID oder Touch ID",
    formFields: [],
  },
  {
    id: "google_pay",
    name: "Google Pay",
    Logo: GooglePayLogo,
    description: "Schnell und sicher mit Google",
    formFields: [],
  },
];
