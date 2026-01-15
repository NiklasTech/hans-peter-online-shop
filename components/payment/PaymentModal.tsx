"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, Loader2, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { PAYMENT_METHODS } from "./PaymentLogos";
import { PaymentForm } from "./PaymentForm";

interface PaymentModalProps {
  isOpen: boolean;
  paymentMethod: string;
  total: string;
  onComplete: () => void;
  onCancel: () => void;
}

type ModalStep = "form" | "processing" | "complete";

const PROCESSING_STEPS = [
  { id: 1, text: "Zahlungsdaten werden überprüft...", duration: 1000 },
  { id: 2, text: "Verbindung zum Zahlungsanbieter...", duration: 1200 },
  { id: 3, text: "Transaktion wird verarbeitet...", duration: 1800 },
  { id: 4, text: "Zahlung erfolgreich!", duration: 600 },
];

export function PaymentModal({ isOpen, paymentMethod, total, onComplete, onCancel }: PaymentModalProps) {
  const [modalStep, setModalStep] = useState<ModalStep>("form");
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [processingStep, setProcessingStep] = useState(0);

  // Use ref to avoid stale closure in async function
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const paymentInfo = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setModalStep("form");
      setProcessingStep(0);
      setFormData({});
      // Apple Pay and Google Pay skip form
      if (paymentMethod === "apple_pay" || paymentMethod === "google_pay") {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
  }, [isOpen, paymentMethod]);

  // Handle processing animation
  useEffect(() => {
    if (modalStep !== "processing") return;

    let timeout: NodeJS.Timeout;
    let cancelled = false;

    const processSteps = async () => {
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        if (cancelled) return;
        setProcessingStep(i);
        await new Promise((resolve) => {
          timeout = setTimeout(resolve, PROCESSING_STEPS[i].duration);
        });
      }
      if (cancelled) return;
      setModalStep("complete");
    };

    processSteps();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [modalStep]);

  // Handle complete step - auto close after delay
  useEffect(() => {
    if (modalStep !== "complete") return;

    const timeout = setTimeout(() => {
      onCompleteRef.current();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [modalStep]);

  const handleFormChange = (data: Record<string, string>, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      setModalStep("processing");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={modalStep === "form" ? onCancel : undefined} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {paymentInfo?.Logo && <paymentInfo.Logo className="h-8" />}
            <div>
              <h2 className="font-semibold text-lg">{paymentInfo?.name}</h2>
              <p className="text-sm text-gray-500">Betrag: {total}</p>
            </div>
          </div>
          {modalStep === "form" && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Form Step */}
          {modalStep === "form" && (
            <div>
              {paymentMethod === "apple_pay" || paymentMethod === "google_pay" ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    {paymentMethod === "apple_pay" ? (
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {paymentMethod === "apple_pay"
                      ? "Bestätige die Zahlung mit Face ID oder Touch ID"
                      : "Bestätige die Zahlung mit deinem Google-Konto"
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Klicke auf "Jetzt bezahlen" um fortzufahren
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Gib deine Zahlungsdaten ein, um die Bestellung abzuschließen.
                  </p>
                  <PaymentForm
                    paymentMethod={paymentMethod}
                    onFormDataChange={handleFormChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Processing Step */}
          {modalStep === "processing" && (
            <div className="py-4">
              {/* Processing Animation */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-800" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {PROCESSING_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      index < processingStep
                        ? "text-green-600 dark:text-green-400"
                        : index === processingStep
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {index < processingStep ? (
                        <Check className="w-5 h-5" />
                      ) : index === processingStep ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span className={`text-sm ${index <= processingStep ? "font-medium" : ""}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Step */}
          {modalStep === "complete" && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                Zahlung erfolgreich!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deine Bestellung wird jetzt bearbeitet...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {modalStep === "form" && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              <span>Jetzt bezahlen</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>256-bit SSL-Verschlüsselung - Deine Daten sind sicher</span>
            </div>
          </div>
        )}

        {/* Processing/Complete Footer */}
        {(modalStep === "processing" || modalStep === "complete") && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Sichere Verbindung - Deine Daten sind geschützt</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
