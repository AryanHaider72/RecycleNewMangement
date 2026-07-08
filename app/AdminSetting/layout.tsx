import React from "react";
import AdminSidebar from "./page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="w-full  px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
