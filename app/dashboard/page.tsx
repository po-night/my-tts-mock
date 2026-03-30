"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LogoutButton from "@/components/logout-button";

// 拡張ポイント: 話者選択や音声パラメータを追加したい場合はこのページを編集する。
type MeResponse = {
  user: {
    id: string;
    remainingChars: number;
  };
};

export default function DashboardPage() {
  const [text, setText] = useState("");
  const [remainingChars, setRemainingChars] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        const data = (await response.json()) as MeResponse & { error?: string };

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        if (data.user.id === "admin") {
          window.location.href = "/admin";
          return;
        }

        setUserId(data.user.id);
        setRemainingChars(data.user.remainingChars);
      } catch {
        setError("ユーザ情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentUser();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        remainingChars?: number;
      };

      if (!response.ok) {
        setError(data.error ?? "音声生成に失敗しました。");
        return;
      }

      setRemainingChars(data.remainingChars ?? null);
      setMessage(data.message ?? "音声を生成しました。");
    } catch {
      setError("通信に失敗しました。");
    } finally {
      setGenerating(false);
    }
  }

  const currentLength = text.length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_25px_70px_rgba(120,84,53,0.12)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              モック音声生成
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              台本を入力して、文字数を消費する流れを確認できます。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/settings"
              className="rounded-full bg-white px-4 py-2 font-medium text-foreground ring-1 ring-border transition hover:bg-[#fff5eb]"
            >
              設定
            </Link>
            <LogoutButton className="rounded-full bg-white px-4 py-2 font-medium text-foreground ring-1 ring-border transition hover:bg-[#fff5eb] disabled:cursor-not-allowed disabled:opacity-70" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-[1.75rem] border border-border bg-white p-5">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-foreground">台本入力</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="min-h-80 w-full rounded-[1.5rem] border border-border bg-[#fffdfa] px-4 py-4 text-sm leading-7 outline-none transition focus:border-accent"
                placeholder="ここに台本を入力してください。"
              />
            </label>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <p>入力文字数: {currentLength} 文字</p>
              <p>残り文字数: {loading ? "読込中..." : remainingChars ?? "-"}</p>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || loading}
                className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
              >
                {generating ? "生成中..." : "音声生成"}
              </button>
              <button
                type="button"
                onClick={() => setMessage("ダミー音声をダウンロードしました。")}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition hover:bg-[#fff5eb]"
              >
                ダウンロード
              </button>
            </div>
          </section>

          <aside className="rounded-[1.75rem] border border-border bg-[#fff8ef] p-5">
            <h2 className="text-lg font-semibold text-foreground">現在の状態</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="rounded-2xl bg-white px-4 py-4">
                <dt className="text-muted">ログイン中ユーザ</dt>
                <dd className="mt-1 font-medium text-foreground">{loading ? "読込中..." : userId}</dd>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <dt className="text-muted">残り文字数</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {loading ? "読込中..." : `${remainingChars ?? 0} 文字`}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  );
}
