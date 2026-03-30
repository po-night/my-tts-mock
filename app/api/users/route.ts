import { NextResponse } from "next/server";

import { listUsers } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();

  if (userId !== "admin") {
    return NextResponse.json({ error: "管理者のみ利用できます。" }, { status: 403 });
  }

  const users = listUsers().map((user) => ({
    id: user.id,
    remainingChars: user.remainingChars,
  }));

  return NextResponse.json({ users });
}
