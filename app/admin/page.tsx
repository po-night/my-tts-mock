import { redirect } from "next/navigation";

import { listUsers } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

// 拡張ポイント: 検索やフィルタを追加したい場合はこのページを編集する。
export default async function AdminPage() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  if (userId !== "admin") {
    redirect("/dashboard");
  }

  const users = listUsers();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_25px_70px_rgba(120,84,53,0.12)] lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">ユーザ一覧</h1>
          </div>
          <a
            href="/dashboard"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border transition hover:bg-[#fff5eb]"
          >
            ダッシュボードへ
          </a>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border bg-white">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-[#fff8ef] text-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">ユーザID</th>
                <th className="px-5 py-4 font-medium">残り文字数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">{user.id}</td>
                  <td className="px-5 py-4">{user.remainingChars}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
