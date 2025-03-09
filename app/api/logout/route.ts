import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  response.cookies.set("token", "", { maxAge: -1, path: "/" });

  return response;
}
