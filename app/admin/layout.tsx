import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AccessDenied from "@/components/admin/AccessDenied";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user has admin session
  const adminSession = await getCurrentAdmin();

  // If no admin session, show access denied page
  if (!adminSession) {
    return <AccessDenied />;
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      <Sidebar isAdmin={true} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
