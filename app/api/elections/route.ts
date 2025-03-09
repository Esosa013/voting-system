import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Election from "@/models/Election";

export const dynamic = "force-dynamic"; // Prevent static generation

export async function GET() {
  await dbConnect();
  const elections = await Election.find();
  return NextResponse.json(elections, { status: 200 });
}

export async function POST(req: Request) {
  await dbConnect();
  const { title, options } = await req.json();

  if (!title || !options || !Array.isArray(options)) {
    return NextResponse.json({ error: "Invalid election data" }, { status: 400 });
  }

  const newElection = new Election({ title, options });
  await newElection.save();

  return NextResponse.json(newElection, { status: 201 });
}
