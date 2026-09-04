"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("লগআউট সফল হয়েছে।");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
    >
      <LogOut className="w-4 h-4 mr-1.5" />
      লগআউট
    </Button>
  );
}
