"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

// 拡張ポイント: ログイン項目や登録フローを増やす場合はこのページを編集する。
type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    const payload =
      mode === "login"
        ? { id: userId, password }
        : { id: userId, password, orderNumber };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "処理に失敗しました。");
        return;
      }

      setMessage(data.message ?? "成功しました。");
      router.push(userId === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setError("通信に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_30px_80px_rgba(120,84,53,0.12)] lg:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
            TTS Mock
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            ログイン / 新規登録
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            検討用の簡易モックです。新規登録では注文番号の形式だけ確認し、初期残量
            10000 文字でユーザを作成します。
          </p>
          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-accent text-white"
                  : "bg-white text-foreground ring-1 ring-border"
              }`}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-accent text-white"
                  : "bg-white text-foreground ring-1 ring-border"
              }`}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">ユーザID</span>
              <input
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-accent"
                placeholder="例: demo-user"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">パスワード</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-accent"
                placeholder="6文字以上を推奨"
                required
              />
            </label>

            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">注文番号</span>
                <input
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="8桁の数字"
                  required
                />
              </label>
            ) : null}

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "処理中..." : mode === "login" ? "ログイン" : "新規登録"}
            </button>
          </form>
        </section>

        <aside className="rounded-[2rem] border border-border bg-white/90 p-8 lg:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">使い方</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <li>新規登録では注文番号が 8 桁の数字かを確認します。</li>
            <li>一般ユーザはダッシュボード、管理者は管理画面へ移動します。</li>
            <li>管理者アカウントは `admin / admin1234` です。</li>
          </ul>
          <div className="mt-8 rounded-3xl bg-[#f7ede3] p-6">
            <p className="text-sm font-medium text-accent">ショートカット</p>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <p>通常ユーザ: 新規登録で作成</p>
              <p>管理者: `/admin` で一覧確認</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            既にログイン済みならダッシュボードへ
          </Link>
        </aside>
      </div>
    </main>
  );
}
