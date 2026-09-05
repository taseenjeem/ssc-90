import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Images, HandHeart, MessageSquare, UserPlus, Upload, Plus, LogOut } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export const revalidate = 60;

async function getDashboardStats() {
  const [members, gallery, initiatives, pendingMessages] = await Promise.all([
    prisma.profile.count(),
    prisma.galleryItem.count(),
    prisma.initiative.count(),
    prisma.memoryMessage.count({ where: { isApproved: false } }),
  ]);
  return { members, gallery, initiatives, pendingMessages };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "মোট সদস্য", value: stats.members, icon: Users, color: "text-rose-600", bg: "bg-rose-50", href: "/admin/members" },
    { label: "গ্যালারি ছবি", value: stats.gallery, icon: Images, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/gallery" },
    { label: "সামাজিক উদ্যোগ", value: stats.initiatives, icon: HandHeart, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/initiatives" },
    { label: "অপেক্ষারত বার্তা", value: stats.pendingMessages, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", href: "/admin/memories" },
  ];

  const quickActions = [
    { label: "নতুন সদস্য যোগ করুন", href: "/admin/members", icon: UserPlus, color: "bg-rose-600 hover:bg-rose-700" },
    { label: "ছবি আপলোড করুন", href: "/admin/gallery", icon: Upload, color: "bg-blue-600 hover:bg-blue-700" },
    { label: "নতুন উদ্যোগ যোগ করুন", href: "/admin/initiatives", icon: Plus, color: "bg-emerald-600 hover:bg-emerald-700" },
  ];

  return (
    <div className="min-h-screen">
      <AdminNav title="ওভারভিউ" subtitle="প্রধান পরিসংখ্যান" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <Link key={card.label} href={card.href}>
              <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-base text-slate-700">দ্রুত কার্যক্রম</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Button asChild key={action.label} className={`${action.color} text-white rounded-xl`}>
                  <Link href={action.href}>
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/admin/members", label: "সদস্য ব্যবস্থাপনা", icon: Users },
            { href: "/admin/gallery", label: "গ্যালারি ব্যবস্থাপনা", icon: Images },
            { href: "/admin/initiatives", label: "উদ্যোগ ব্যবস্থাপনা", icon: HandHeart },
            { href: "/admin/memories", label: "বার্তা অনুমোদন", icon: MessageSquare },
          ].map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow group"
            >
              <nav.icon className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-rose-600 transition-colors" />
              <p className="text-sm font-medium text-slate-700">{nav.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
