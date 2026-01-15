"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PAYMENT_METHODS } from "./PaymentLogos";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  paymentMethod: string;
  onComplete: () => void;
}

const PROCESSING_STEPS = [
  { id: 1, text: "Zahlungsdaten werden überprüft...", duration: 1200 },
  { id: 2, text: "Verbindung zum Zahlungsanbieter...", duration: 1500 },
  { id: 3, text: "Transaktion wird verarbeitet...", duration: 2000 },
  { id: 4, text: "Zahlung erfolgreich!", duration: 800 },
];

export function PaymentProcessingModal({ isOpen, paymentMethod, onComplete }: PaymentProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const paymentInfo = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      return;
    }

    let timeout: NodeJS.Timeout;

    const processSteps = async () => {
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => {
          timeout = setTimeout(resolve, PROCESSING_STEPS[i].duration);
        });
      }
      setIsComplete(true);
      await new Promise((resolve) => {
        timeout = setTimeout(resolve, 1000);
      });
      onComplete();
    };

    processSteps();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Payment Provider Logo */}
        <div className="flex justify-center mb-6">
          {paymentInfo?.Logo && <paymentInfo.Logo className="h-8" />}
        </div>

        {/* Processing Animation */}
        <div className="flex justify-center mb-8">
          {isComplete ? (
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-800" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {PROCESSING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index < currentStep
                  ? "text-green-600 dark:text-green-400"
                  : index === currentStep
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : index === currentStep ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <span className={`text-sm ${index <= currentStep ? "font-medium" : ""}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Sichere Verbindung - Deine Daten sind geschützt</span>
        </div>
      </div>
    </div>
  );
}
