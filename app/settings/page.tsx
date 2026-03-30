"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

// 拡張ポイント: メール通知や契約情報を増やす場合はこのページを編集する。
type MeResponse = {
  user: {
    id: string;
    remainingChars: number;
  };
};

export default function SettingsPage() {
  const [remainingChars, setRemainingChars] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        const data = (await response.json()) as MeResponse;

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        setRemainingChars(data.user.remainingChars);
      } catch {
        setError("ユーザ情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentUser();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "パスワード変更に失敗しました。");
        return;
      }

      setMessage(data.message ?? "変更しました。");
      setPassword("");
    } catch {
      setError("通信に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10">
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_25px_70px_rgba(120,84,53,0.12)] lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">ユーザ設定</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border transition hover:bg-[#fff5eb]"
          >
            ダッシュボードへ
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.75rem] border border-border bg-[#fff8ef] p-6">
            <h2 className="text-lg font-semibold text-foreground">契約状況</h2>
            <p className="mt-5 text-sm text-muted">現在の残り文字数</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
              {loading ? "..." : remainingChars}
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-foreground">パスワード変更</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">新しいパスワード</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="6文字以上"
                  required
                />
              </label>

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
                disabled={saving}
                className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "更新中..." : "パスワード変更"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
