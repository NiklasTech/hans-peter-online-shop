"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              Hans Peter Shop
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dein Online-Shop für hochwertige Produkte
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+49 123 456789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>kontakt@hanspetershop.de</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Musterstadt, Deutschland</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Kategorien
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/products/men"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Männer
                </Link>
              </li>
              <li>
                <Link
                  href="/products/women"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Frauen
                </Link>
              </li>
              <li>
                <Link
                  href="/products/accessories"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Zubehör
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Kundenservice
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Versand & Rückgabe
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/tracking"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Bestellverfolgung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/imprint"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Cookie-Einstellungen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
              © 2025 Hans Peter Shop. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Facebook
              </Link>
              <Link
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
