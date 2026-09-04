# Ultimate Production Blueprint & Autonomous Development Specification: SSC Batch 90 (এসএসসি ব্যাচ ৯০)

> **Document Type:** Full Production Implementation Masterfile  
> **Target Audience & Executor:** Antigravity IDE / Autonomous AI Software Engineer Agent  
> **Application Name:** এসএসসি ব্যাচ ৯০ (SSC Batch 90 Alumni & Nostalgia Hub)  
> **Core Objective:** Build a bulletproof, accessible, high-performance, fully localized Bengali web application for the SSC Batch 1990 cohort.  
> **Strict Compliance Directive:** Every single library, architectural pattern, environment variable, schema field, and UI specification documented herein is **mandatory**. No component may be mocked, substituted, or omitted.

---

## 1. Complete System Architecture & Technology Mandate

The autonomous agent must install, configure, and use every package listed below without deviation:

| Layer / Domain | Exact Technology & Packages | Enforcement Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19) | Server Actions for all mutations, Server Components by default, Client Components strictly when interactivity is required (`'use client'`). |
| **Language** | TypeScript (Strict Mode) | No `any` types allowed. Explicit interfaces for database payloads, form states, and action results. |
| **Database & ORM** | PostgreSQL via Supabase + Prisma ORM | Prisma Client acts as the data-access layer. Connection pooler port `6543` for application queries, Direct port `5432` for schema push/migrations. |
| **Authentication** | Supabase Auth (`@supabase/ssr`) | SSR cookie-based session handling. Protection of all `/admin/*` routes via Next.js Middleware. |
| **Cloud Storage** | Supabase Storage Buckets | Standardized public buckets: `members`, `gallery`, and `initiatives`. Automatic URL persistence to Prisma models. |
| **UI Primitives & Styling** | Tailwind CSS + Shadcn UI | All UI elements must use Radix UI-backed Shadcn components (Button, Card, Dialog, Form, Input, Select, Table, Tabs, Avatar, Badge, Sheet, DropdownMenu, Skeleton). |
| **Bengali Typography** | `next/font/google` (`Hind Siliguri`) | Strict Bengali font loading with subsets `bengali`, variable `--font-hind-siliguri`, zero layout shifts. |
| **Micro-Animations** | Framer Motion | Smooth staggered grid entries, modal pop-ins, and page transitions. |
| **Media Lightbox** | `yet-another-react-lightbox` | Zoom, Fullscreen, Thumbnails, and Slideshow plugins enabled for reunion photos and member profile pictures. |
| **Forms & Validation** | React Hook Form + Zod (`@hookform/resolvers`) | Type-safe form validation with custom Bengali error messages. |
| **Batch Data Ingestion** | `xlsx` (SheetJS) | Server-side parsing of uploaded `.xlsx` files for bulk member creation. |
| **Client-Side Generation** | `html-to-image` | Conversion of DOM member badge nodes into downloadable high-res PNG digital ID cards. |
| **Notification Feedback** | `sonner` | Rich, branded toast notifications for CRUD actions and error events. |

---

## 2. Environment Configuration (`.env.local`)

Write the exact configuration below into the root file `.env.local`:

```env
# -----------------------------------------------------------------------------
# SUPABASE PUBLIC CREDENTIALS
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://pzowrpnbbymuvfnwuqhh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_EC2kL-9Y1x2b6SgyS0G5yg_bKoBPwDy

# -----------------------------------------------------------------------------
# SUPABASE STORAGE BUCKET DEFINITIONS
# -----------------------------------------------------------------------------
NEXT_PUBLIC_STORAGE_BUCKET_MEMBERS=members
NEXT_PUBLIC_STORAGE_BUCKET_GALLERY=gallery
NEXT_PUBLIC_STORAGE_BUCKET_INITIATIVES=initiatives

# -----------------------------------------------------------------------------
# PRISMA POSTGRESQL CONNECTION POOLERS
# -----------------------------------------------------------------------------
# Transaction Pooler (Session/Shared IPv4 Pooler via PgBouncer - Application Queries)
DATABASE_URL="postgresql://postgres.pzowrpnbbymuvfnwuqhh:GXH3akUlG3AqbCWh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Session Connection (Standard PostgreSQL Connection - Schema Push & Migrations)
DIRECT_URL="postgresql://postgres.pzowrpnbbymuvfnwuqhh:GXH3akUlG3AqbCWh@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

## 3. Exhaustive Prisma Schema (`prisma/schema.prisma`)

Replace `prisma/schema.prisma` with the complete model specification:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -----------------------------------------------------------------------------
// 1. MEMBER PROFILE MODEL
// -----------------------------------------------------------------------------
model Profile {
  id               String   @id @default(uuid())
  userId           String   @unique // Internal unique identifier or Supabase UUID
  banglaFullName   String   // বাংলা পূর্ণ নাম (e.g., 'মো: রফিকুল ইসলাম')
  engFullName      String   // English Full Name (e.g., 'Md. Rafiqul Islam')
  nickName         String   // ডাকনাম (e.g., 'রফিক')
  gender           String   // 'পুরুষ' | 'মহিলা'
  bloodGroup       String   // 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
  schoolName       String   // এসএসসি ১৯৯০ এর স্কুলের নাম
  maritalStatus    String   // 'বিবাহিত' | 'অবিবাহিত' | 'অন্যান্য'
  childrenCount    Int?     @default(0) // সন্তানের সংখ্যা
  profession       String   // পেশা ও কর্মক্ষেত্র
  currentAddress   String   // বর্তমান বাসস্থান / জেলা
  permanentAddress String   // স্থায়ী ঠিকানা / পৈতৃক ভিটা
  personalMobile   String   // মূল যোগাযোগের মোবাইল নম্বর
  altMobile        String   // বিকল্প / জরুরি যোগাযোগের মোবাইল নম্বর
  profilePicture   String?  // Supabase Storage Public URL (বর্তমান ছবি)
  thenPhoto        String?  // Supabase Storage Public URL (১৯৯০ সালের স্কুল জীবনের ছবি)
  aboutMe          String?  // স্কুল জীবনের স্মৃতিচারণ বা আত্মকথা
  isDeceased       Boolean  @default(false) // প্রয়াত বন্ধুদের জন্য স্মরণিকা ফ্ল্যাগ
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([schoolName])
  @@index([bloodGroup])
  @@index([isDeceased])
}

// -----------------------------------------------------------------------------
// 2. REUNION & PHOTO GALLERY MODEL
// -----------------------------------------------------------------------------
model GalleryItem {
  id          String   @id @default(uuid())
  title       String   // ছবির শিরোনাম (বাংলায়)
  description String?  // বিস্তারিত স্মৃতি বা বিবরণ
  imageUrl    String   // Supabase Storage Public URL
  eventDate   String?  // অনুষ্ঠানের তারিখ (e.g., '১৫ জানুয়ারি, ২০২৪')
  category    String   // 'পুনর্মিলনী', 'স্কুল জীবন', 'ট্যুর ও আড্ডা', 'স্মারক'
  featured    Boolean  @default(false) // হোমপেজ হাইলাইটের জন্য
  createdAt   DateTime @default(now())

  @@index([category])
  @@index([featured])
}

// -----------------------------------------------------------------------------
// 3. HUMANITARIAN & SOCIAL WELFARE INITIATIVES
// -----------------------------------------------------------------------------
model Initiative {
  id          String   @id @default(uuid())
  title       String   // উদ্যোগের শিরোনাম (e.g., 'বন্যা দুর্গতদের ত্রাণ বিতরণ ২০২৪')
  description String   // বিস্তারিত কর্মসূচি ও অর্জনের বিবরণ
  date        String   // বাস্তবায়নের তারিখ / সময়কাল
  location    String   // স্থান / এলাকা
  images      String[] // Supabase Storage Public URLs
  budget      String?  // তহবিল / ব্যয়ের হিসাব (e.g., '২,৫০,০০০ টাকা')
  impact      String?  // সুবিধাভোগীর বিবরণ (e.g., '৬০০+ পরিবার')
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// -----------------------------------------------------------------------------
// 4. MODERATED GUESTBOOK & MEMORY WALL
// -----------------------------------------------------------------------------
model MemoryMessage {
  id          String   @id @default(uuid())
  senderName  String   // স্মৃতিচারণকারীর নাম
  schoolName  String?  // স্কুলের নাম
  message     String   // বন্ধুদের উদ্দেশ্যে বার্তা
  isApproved  Boolean  @default(false) // অ্যাডমিন অ্যাপ্রুভাল ফ্ল্যাগ
  createdAt   DateTime @default(now())

  @@index([isApproved])
}
```

---

## 4. Supabase Client & SSR Middleware Implementation

### 4.1 Server Client (`utils/supabase/server.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled safely in Server Component contexts
          }
        },
      },
    }
  );
};
```

### 4.2 Browser Client (`utils/supabase/client.ts`)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
```

### 4.3 Route Guard & Session Refresh (`utils/supabase/middleware.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // If accessing any /admin route (except /admin/login) without auth, redirect to /admin/login
  if (isAdminRoute && !isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated admin attempts to access /admin/login, redirect to /admin/dashboard
  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
};
```

### 4.4 Root Middleware (`middleware.ts`)
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 5. UI Setup, Fonts & Layout

### 5.1 Root Layout (`app/layout.tsx`)
```tsx
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "এসএসসি ব্যাচ ৯০ - স্মৃতির আঙিনা ও বন্ধুদের বন্ধন",
  description: "১৯৯০ সালের এসএসসি ব্যাচের স্মৃতিচারণ, পুনর্মিলনী, সদস্য ডিরেক্টরি এবং মানবকল্যাণমূলক কার্যক্রমের সমন্বয় প্ল্যাটফর্ম।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
```

### 5.2 Tailwind Configuration (`tailwind.config.ts`)
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 6. Detailed Feature & Page Implementation Specifications

### 6.1 Landing Page (`app/(public)/page.tsx`)
1. **Hero Section:**
   - Full-bleed banner image of batch reunion with dark gradient overlay.
   - Headline: *"তিন দশকের বন্ধুত্ব, স্মৃতির আঙিনায় চিরন্তন"* with Hind Siliguri Bold styling.
   - Quick CTA Buttons: "সদস্য ডিরেক্টরি খুঁজুন" (links to `/members`) and "পুনর্মিলনী গ্যালারি" (links to `/gallery`).
2. **Metric Counters (Live Prisma Queries):**
   - Total registered members count.
   - Total schools represented count.
   - Total social welfare initiatives launched.
   - Total memories archived.
3. **Featured Moments Grid:**
   - Top 6 `GalleryItem` entries flagged with `featured: true`.
   - On click, triggers instant zoom modal.
4. **Recent Initiatives Preview:**
   - 3 cards showing latest community work with impact badges.

### 6.2 Reunion Gallery (`app/(public)/gallery/page.tsx`)
1. **Category Filter Tabs (Shadcn Tabs):**
   - All ('সব'), Reunion ('পুনর্মিলনী'), School Days ('স্কুল জীবন'), Tours & Hangouts ('ট্যুর ও আড্ডা').
2. **Interactive Masonry/Grid View:**
   - Responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`).
   - Cards display image with hover zoom effect (`group-hover:scale-105 transition-all duration-300`).
   - Overlay showing title, event date, and category badge.
3. **Lightbox Integration (`yet-another-react-lightbox`):**
   - Clicking any photo opens the lightbox with full resolution.
   - Plugins enabled: `Fullscreen`, `Slideshow`, `Thumbnails`, `Zoom`.
   - Supports keyboard arrow navigation and mobile touch swipe.

### 6.3 Member Directory (`app/(public)/members/page.tsx`)
1. **Client-Side Live Filtering:**
   - Search input matching Bengali Name, English Name, or Nickname.
   - Select dropdown for `schoolName` populated dynamically with unique school names.
   - Select dropdown for `bloodGroup` (`A+`, `B+`, etc.).
2. **Member Card Layout:**
   - Avatar picture (with fallback placeholder if null).
   - Bengali full name in bold, nickname in parentheses.
   - School name with a book icon.
   - Blood group badge in soft red accent.
   - "সম্পূর্ণ প্রোফাইল" button leading to `/members/[id]`.

### 6.4 Single Member Profile (`app/(public)/members/[id]/page.tsx`)
1. **High-Res Avatar Modal:**
   - Clicking on the profile photo opens a dedicated high-resolution zoom dialog using Shadcn `Dialog`.
2. **Information Grid:**
   - Display every field from the Prisma `Profile` model in structured cards: Personal Details, Academic Background, Profession, Addresses, and Contacts.
3. **"Then & Now" Nostalgia Slider:**
   - If `thenPhoto` exists in database, render a visual comparison card displaying the 1990 school photo alongside the current photo.
4. **Downloadable Digital Alumni Card (`html-to-image`):**
   - Render a card component with batch branding, gold-border accents, photo, batch year "SSC 1990", school name, blood group, and unique member ID.
   - Provide a "ডিজিটাল আইডি কার্ড ডাউনলোড" button that calls `htmlToImage.toPng(cardElementRef)` and triggers immediate file download (`SSC90_[nickName].png`).

### 6.5 Emergency Blood Directory (`app/(public)/blood-bank/page.tsx`)
- Categorized blood group pills (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).
- Lists eligible donor members with current city and a direct `tel:${personalMobile}` call button for quick emergencies.

### 6.6 Wall of Thoughts / Guestbook (`app/(public)/memories/page.tsx`)
- Display grid of approved messages (`isApproved: true`).
- A floating action button or card with a "স্মৃতি লিখুন" trigger opening a submission dialog.
- Fields: Name (`senderName`), School (`schoolName`), Message (`message`).
- Submission calls a Server Action inserting into `MemoryMessage` with `isApproved: false`.
- Success toast notification: *"আপনার স্মৃতিবার্তা সফলভাবে জমা হয়েছে। অ্যাডমিনের অনুমোদনের পর এটি প্রদর্শিত হবে।"*

### 6.7 In Memoriam / শ্রদ্ধাঞ্জলি (`app/(public)/in-memoriam/page.tsx`)
- Filter members where `isDeceased == true`.
- Monochromatic, respectful theme with floral badge tribute.
- Shows departed photo, school name, and an open space for batchmates to leave condolence notes.

---

## 7. Hidden Admin Management Architecture (`/admin`)

### 7.1 Admin Login (`app/admin/login/page.tsx`)
- Clean, centered login card with no public links pointing to it.
- Email and password authentication using Supabase client:
  ```typescript
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  ```
- Redirects to `/admin/dashboard` upon successful authentication.

### 7.2 Admin Dashboard (`app/admin/dashboard/page.tsx`)
- 4 Statistics Cards: Total Members, Total Gallery Images, Total Initiatives, Pending Memory Approvals.
- Quick shortcut buttons: "নতুন সদস্য যোগ করুন", "ছবি আপলোড করুন", "নতুন উদ্যোগ যোগ করুন".

### 7.3 Member Management (`app/admin/members/page.tsx`)
1. **DataTable (TanStack / Shadcn):**
   - Column headers: ছবি, নাম, স্কুল, রক্তের গ্রুপ, মোবাইল, একশন (এডিট, ডিলিট).
2. **Add / Edit Member Dialog (React Hook Form + Zod):**
   - Full validation schema matching Prisma `Profile`.
   - File input that uploads directly to the Supabase Storage `members` bucket and receives the public URL.
3. **Bulk Excel Upload (`xlsx` / SheetJS):**
   - File dropzone accepting `.xlsx` and `.csv` files.
   - Expected columns: `banglaFullName`, `engFullName`, `nickName`, `gender`, `bloodGroup`, `schoolName`, `maritalStatus`, `profession`, `currentAddress`, `permanentAddress`, `personalMobile`, `altMobile`.
   - Server Action parses sheet rows and executes `prisma.profile.createMany` inside a single transaction.

### 7.4 Gallery Manager (`app/admin/gallery/page.tsx`)
- Image upload form with title, category selector, event date, and "হোমপেজে হাইলাইট" checkbox.
- Files uploaded to Supabase Storage `gallery` bucket.
- Thumbnail grid with instant "মুছে ফেলুন" (Delete) action with confirmation dialog.

### 7.5 Initiatives Manager (`app/admin/initiatives/page.tsx`)
- CRUD interface for community welfare projects.
- Multi-image upload field uploading to the `initiatives` bucket.
- Markdown or rich textarea for detailed initiative descriptions.

### 7.6 Memory Moderation Queue (`app/admin/memories/page.tsx`)
- Table displaying unapproved submissions.
- Actions: "অনুমোদন করুন" (updates `isApproved: true`) and "বাতিল করুন" (deletes record).

---

## 8. Complete Project File Tree

```
ssc-batch-90/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── members/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── initiatives/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── memories/
│   │   │   └── page.tsx
│   │   ├── blood-bank/
│   │   │   └── page.tsx
│   │   └── in-memoriam/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── members/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── initiatives/
│   │   │   └── page.tsx
│   │   └── memories/
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── members/
│   │   ├── MemberCard.tsx
│   │   ├── MemberIdCard.tsx
│   │   └── ThenNowSlider.tsx
│   ├── gallery/
│   │   └── GalleryLightbox.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       └── sonner.tsx
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── utils/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── middleware.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── placeholder-avatar.png
├── .env.local
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. Execution Guide for Antigravity IDE

Execute the following sequential terminal commands to initialize and build the production bundle:

```bash
# 1. Project Initialization
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# 2. Package Installation
npm install @prisma/client @supabase/ssr @supabase/supabase-js lucide-react framer-motion yet-another-react-lightbox react-hook-form @hookform/resolvers zod sonner xlsx html-to-image clsx tailwind-merge class-variance-authority tailwindcss-animate
npm install -D prisma @types/node

# 3. Setup Shadcn Primitives
npx shadcn@latest init -d
npx shadcn@latest add button card dialog form input select table tabs avatar badge dropdown-menu sheet skeleton

# 4. Generate Prisma Client & Push Schema to Supabase
npx prisma db push

# 5. Build for Production Verification
npm run build
npm run start
```