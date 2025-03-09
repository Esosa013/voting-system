import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Election from "@/models/Election";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, electionId, option } = await req.json();
    if (!email || !electionId || !option) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.votedElections.includes(electionId)) {
      return NextResponse.json({ error: "You have already voted in this election" }, { status: 403 });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    const voteIndex = election.options.findIndex((opt: { name: string; count: number }) => opt.name === option);
    if (voteIndex === -1) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    election.options[voteIndex].count += 1;
    await election.save();

    user.votedElections.push(electionId);
    await user.save();

    return NextResponse.json({ message: "Vote recorded", election }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
