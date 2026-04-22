import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
    }

    // In a real app, you might send an email or save to a database here.
    // For now, we'll just log it and return success to avoid Footer 404s.
    console.log(`[Contact Form] From: ${email}, Message: ${message}`);

    return NextResponse.json({ 
      success: true, 
      message: "Pesan Anda telah diterima. Kami akan segera menghubungi Anda." 
    });
  } catch (error) {
    console.error("[API] Contact form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
