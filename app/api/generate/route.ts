import { NextResponse } from "next/server";

import { consumeCharacters } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

// 拡張ポイント: 実際のTTS連携を行う場合はこの route に外部API呼び出しを追加する。
export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "ログインしてください。" }, { status: 401 });
  }

  const body = (await request.json()) as {
    text?: string;
  };

  const text = body.text ?? "";

  try {
    const user = consumeCharacters(userId, text.length);

    return NextResponse.json({
      message: `音声生成が完了しました。${text.length}文字を消費しました。`,
      remainingChars: user.remainingChars,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "音声生成に失敗しました。" },
      { status: 400 },
    );
  }
}
