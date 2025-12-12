"use client";

import { ShieldX, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <ShieldX className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Zugriff verweigert
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Du hast keine Berechtigung, auf den Admin-Bereich zuzugreifen.
          Bitte melde dich mit einem Admin-Account an.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Zur Startseite
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <LogIn className="h-4 w-4 mr-2" />
              Anmelden
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
