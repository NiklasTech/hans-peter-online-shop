import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  Euro,
  Globe,
  RotateCcw,
  Shield,
  Info,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Versandinformationen - Hans Peter Online Shop",
  description: "Alle Informationen zu Versand, Lieferzeiten und Kosten",
};

export default function ShippingPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="w-10 h-10 text-blue-600" />
              Versandinformationen
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Alles über unseren Versand, Lieferzeiten und Rückgaberichtlinien
            </p>
          </div>

          {/* Kostenloser Versand Banner */}
          <Card className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    Kostenloser Versand ab 50€
                  </h2>
                  <p className="text-blue-800 dark:text-blue-200">
                    Bestelle für mindestens 50€ und spare die Versandkosten. Schnell, sicher und zuverlässig zu dir nach Hause.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Versandkosten */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-blue-600" />
                  Versandkosten
                </CardTitle>
                <CardDescription>Transparente Preise für jeden Einkauf</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Ab 50€ Bestellwert
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">Deutschlandweit</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Kostenlos
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Unter 50€ Bestellwert
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deutschlandweit</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">4,99€</span>
                </div>
              </CardContent>
            </Card>

            {/* Lieferzeiten */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Lieferzeiten
                </CardTitle>
                <CardDescription>Schnelle Lieferung garantiert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Deutschland</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2-3 Werktage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">EU-Länder</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">4-7 Werktage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bestellungen vor 14:00 Uhr werden noch am selben Tag versendet
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Versandprozess */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                So funktioniert der Versand
              </CardTitle>
              <CardDescription>Vom Bestelleingang bis zur Haustür</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    1. Bestellung
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Du bestellst online und erhältst sofort eine Bestätigung
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    2. Verpackung
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wir verpacken deine Artikel sorgfältig und sicher
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">3. Versand</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dein Paket wird mit DHL verschickt und du erhältst eine Trackingnummer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    4. Zustellung
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dein Paket kommt sicher an deiner Wunschadresse an
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Versandpartner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Unsere Versandpartner
                </CardTitle>
                <CardDescription>Zuverlässig und erfahren</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                  <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center font-bold text-black text-xl">
                    DHL
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      DHL Paket
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hauptversandpartner für alle Lieferungen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <p>
                    Alle Sendungen sind versichert und können über die Trackingnummer verfolgt
                    werden
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Internationale Lieferung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Internationale Lieferung
                </CardTitle>
                <CardDescription>Versand innerhalb der EU</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      EU-Länder
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">9,99€</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wir liefern derzeit in alle EU-Länder. Die Lieferzeit beträgt 4-7 Werktage.
                  </p>
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <p>
                      Zollgebühren oder Steuern können zusätzlich anfallen, je nach Zielland
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rückgabe & Umtausch */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                Rückgabe & Umtausch
              </CardTitle>
              <CardDescription>14 Tage Rückgaberecht</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    ✓ Kostenlose Rücksendung innerhalb Deutschlands
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Du hast 14 Tage Zeit, um deine Bestellung zu retournieren - ohne Angabe von
                    Gründen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      So funktioniert die Rücksendung:
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex gap-2">
                        <span className="font-semibold shrink-0">1.</span>
                        <span>Melde dich in deinem Account an und gehe zu "Bestellungen"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold shrink-0">2.</span>
                        <span>Wähle die zu retournierenden Artikel aus</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold shrink-0">3.</span>
                        <span>Drucke das Rücksendeetikett aus</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold shrink-0">4.</span>
                        <span>Schicke das Paket zurück</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold shrink-0">5.</span>
                        <span>Erhalte dein Geld zurück (innerhalb von 5-7 Werktagen)</span>
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Wichtige Hinweise:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Artikel müssen unbenutzt und originalverpackt sein</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Bewahre die Originalverpackung auf</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Rückerstattung auf die ursprüngliche Zahlungsmethode</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>
                          Bei internationalen Rücksendungen können Kosten anfallen
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Häufig gestellte Fragen</CardTitle>
              <CardDescription>Antworten auf die wichtigsten Fragen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Kann ich meine Bestellung verfolgen?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ja, sobald deine Bestellung versendet wurde, erhältst du eine E-Mail mit der
                    Trackingnummer. Du kannst deine Sendung auch in deinem Account unter
                    "Bestellungen" verfolgen.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Was passiert, wenn ich nicht zu Hause bin?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    DHL hinterlässt eine Benachrichtigung und bringt das Paket zur nächsten
                    Postfiliale oder Packstation. Dort kannst du es innerhalb von 7 Tagen abholen.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Kann ich an eine Packstation liefern lassen?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ja, gib einfach die Packstationadresse als Lieferadresse an. Stelle sicher,
                    dass du deine Postnummer angibst.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Was ist, wenn mein Paket beschädigt ankommt?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bitte kontaktiere umgehend unseren Kundenservice mit Fotos der Beschädigung.
                    Wir werden schnellstmöglich eine Lösung finden und dir kostenlos Ersatz
                    schicken.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Package className="w-5 h-5 mr-2" />
                Jetzt einkaufen
              </Button>
            </Link>
            <Link href="/account">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MapPin className="w-5 h-5 mr-2" />
                Meine Bestellungen
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
