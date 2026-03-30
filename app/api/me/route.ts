import { NextResponse } from "next/server";

import { findUser } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 });
  }

  const user = findUser(userId);

  if (!user) {
    return NextResponse.json({ error: "ユーザが見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      remainingChars: user.remainingChars,
    },
  });
}
