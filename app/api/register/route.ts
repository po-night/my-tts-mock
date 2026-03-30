import { NextResponse } from "next/server";

import { createUser } from "@/lib/mock-store";
import { setSessionUserId } from "@/lib/session";

// 拡張ポイント: 注文番号の照合ロジックを本番APIにつなぐ場合はこの route を編集する。
export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    password?: string;
    orderNumber?: string;
  };

  const id = body.id?.trim();
  const password = body.password?.trim();
  const orderNumber = body.orderNumber?.trim();

  if (!id || !password || !orderNumber) {
    return NextResponse.json({ error: "必須項目を入力してください。" }, { status: 400 });
  }

  if (!/^\d{8}$/.test(orderNumber)) {
    return NextResponse.json(
      { error: "注文番号は8桁の数字で入力してください。" },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "パスワードは6文字以上で入力してください。" },
      { status: 400 },
    );
  }

  try {
    const user = createUser(id, password);
    await setSessionUserId(user.id);

    return NextResponse.json({
      message: "ユーザを作成しました。",
      user: { id: user.id, remainingChars: user.remainingChars },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ユーザ作成に失敗しました。" },
      { status: 400 },
    );
  }
}
