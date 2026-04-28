import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json("✅ The backend service is up.");
}
