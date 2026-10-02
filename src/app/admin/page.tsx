import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminDashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminNav adminName={session?.name} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8 overflow-auto">
        <AdminDashboardClient />
      </main>
    </div>
  );
}
