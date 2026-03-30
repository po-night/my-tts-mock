import { redirect } from "next/navigation";

import { findUser } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

// 拡張ポイント: ページごとの権限制御を増やすならこのファイルに関数を追加する。
export async function requireUser() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = findUser(userId);

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.id !== "admin") {
    redirect("/dashboard");
  }

  return user;
}
