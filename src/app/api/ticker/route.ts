import { NextResponse } from "next/server";
import { fetchTicker } from "@/lib/api";

export async function GET() {
  const data = await fetchTicker();
  return NextResponse.json(data);
}

