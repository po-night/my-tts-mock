import { NextResponse } from "next/server";

import { setSessionUserId } from "@/lib/session";
import { validateUser } from "@/lib/mock-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    password?: string;
  };

  const id = body.id?.trim();
  const password = body.password?.trim();

  if (!id || !password) {
    return NextResponse.json({ error: "IDとパスワードを入力してください。" }, { status: 400 });
  }

  const user = validateUser(id, password);

  if (!user) {
    return NextResponse.json(
      { error: "IDまたはパスワードが一致しません。" },
      { status: 401 },
    );
  }

  await setSessionUserId(user.id);

  return NextResponse.json({
    message: "ログインしました。",
    user: { id: user.id, remainingChars: user.remainingChars },
  });
}
