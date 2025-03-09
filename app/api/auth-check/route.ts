import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
