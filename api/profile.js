// Fonction serverless Vercel : GET /api/profile?riotId=Pseudo%23TAG&platform=EUW1
import { profileHandler } from "../lib/handler.js";

export default async function handler(req, res) {
  const { status, body } = await profileHandler(req.query || {}, process.env);
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}
