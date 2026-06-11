import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.VIDEOMENTUM_API_BASE_URL ?? "https://videomentum.com/api";
const EMAIL_API_URL = `${API_BASE.replace(/\/?$/, "")}/email.aspx`;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const from = String(body.from ?? "").trim();
    const fromname = String(body.fromname ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const emailBody = String(body.body ?? "").trim();

    if (!from || !fromname || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields: from, fromname, subject, body" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      from,
      fromname,
      subject,
      body: emailBody,
    });

    const res = await fetch(EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://videomentum.com/",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Email service unavailable" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
