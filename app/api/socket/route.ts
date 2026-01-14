import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response("Socket.io server is running", { status: 200 });
}
