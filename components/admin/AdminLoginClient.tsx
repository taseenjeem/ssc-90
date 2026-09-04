"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    } else {
      toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-rose-500 to-red-600 p-3 rounded-2xl shadow-xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">অ্যাডমিন প্যানেল</h1>
          <p className="text-slate-400 text-sm mt-1">এসএসসি ব্যাচ ৯০ ম্যানেজমেন্ট</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="text-sm text-white/80 font-medium mb-1.5 block">ইমেইল</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-rose-400 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm text-white/80 font-medium mb-1.5 block">পাসওয়ার্ড</label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-rose-400 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold py-2.5 mt-2"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </Button>
        </form>
      </div>
    </div>
  );
}
