import type { Metadata } from "next";
import AdminLoginClient from "@/components/admin/AdminLoginClient";

export const metadata: Metadata = {
  title: "অ্যাডমিন লগইন | এসএসসি ব্যাচ ৯০",
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
