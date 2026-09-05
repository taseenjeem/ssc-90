import Link from "next/link";
import { GraduationCap, Heart, Phone, Mail } from "lucide-react";

const footerLinks = [
  { href: "/members", label: "সদস্য ডিরেক্টরি" },
  { href: "/gallery", label: "ফটো গ্যালারি" },
  { href: "/initiatives", label: "সামাজিক উদ্যোগ" },
  { href: "/blood-bank", label: "রক্তদান ব্যাংক" },
  { href: "/memories", label: "স্মৃতির দেয়াল" },
  { href: "/in-memoriam", label: "শ্রদ্ধাঞ্জলি" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-rose-500 to-red-600 p-2.5 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">এসএসসি ব্যাচ ৯০</p>
                <p className="text-slate-400 text-xs">SSC Batch 1990 Alumni</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              তিন দশকের বন্ধুত্ব, স্মৃতির আঙিনায় চিরন্তন। ১৯৯০ সালের এসএসসি ব্যাচের 
              অ্যালামনাই ও স্মৃতিচারণ প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-rose-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              যোগাযোগ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>ব্যাচ সচিবালয়ের সাথে যোগাযোগ করুন</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>sscbatch90@alumni.edu.bd</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © ২০২৬ এসএসসি ব্যাচ ৯০ অ্যালামনাই। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              তৈরি করা হয়েছে <Heart className="w-3 h-3 text-rose-500" /> দিয়ে বন্ধুদের জন্য
            </p>
            <span className="text-slate-700">·</span>
            <Link
              href="/admin/login"
              className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              অ্যাডমিন পোর্টাল
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
