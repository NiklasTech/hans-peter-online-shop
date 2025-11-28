import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] bg-white dark:bg-slate-900 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Seite nicht gefunden
        </p>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
        </p>
        <Link href="/">
          <Button className="mt-4">
            Zurück zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
}
