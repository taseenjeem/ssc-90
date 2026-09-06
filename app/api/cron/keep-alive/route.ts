import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Verify Vercel Cron Secret if set in environment variables
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    // 1. Direct PostgreSQL query via Prisma to wake/keep Postgres instance active
    await prisma.$queryRaw`SELECT 1 as alive;`;

    // 2. Direct HTTP ping to Supabase REST API to register PostgREST activity
    let restApiStatus = "Not configured";
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseKey) {
      const restResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Profile?select=id&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          cache: "no-store",
        }
      );
      restApiStatus = `HTTP ${restResponse.status} ${restResponse.statusText}`;
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping executed successfully",
      timestamp: new Date().toISOString(),
      durationMs: duration,
      checks: {
        postgresDatabase: "Healthy & Active",
        supabaseRestApi: restApiStatus,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Supabase keep-alive cron error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to ping database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
