import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resp = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const data = await resp.json();

    if (data.result === "success" && data.rates && data.rates.IDR) {
      return NextResponse.json({
        success: true,
        rate: Math.round(data.rates.IDR),
        date: new Date(data.time_last_update_unix * 1000).toISOString(),
      });
    }
    throw new Error("Invalid API response");
  } catch (error: any) {
    console.error("Server-side exchange rate fetch failed:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
