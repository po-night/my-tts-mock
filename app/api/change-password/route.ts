import { NextResponse } from "next/server";

import { updatePassword } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 });
  }

  const body = (await request.json()) as {
    password?: string;
  };

  const password = body.password?.trim();

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "パスワードは6文字以上で入力してください。" },
      { status: 400 },
    );
  }

  try {
    updatePassword(userId, password);

    return NextResponse.json({
      message: "パスワードを変更しました。",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "変更に失敗しました。" },
      { status: 400 },
    );
  }
}
