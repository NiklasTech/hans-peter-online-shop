import { getCurrentAdmin } from "@/lib/auth";
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
    <>
      <Sidebar isAdmin={true} />
      <main className="min-h-[calc(100vh-73px)] overflow-auto">{children}</main>
    </>
  );
}
