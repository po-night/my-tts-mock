"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  className?: string;
};

// 拡張ポイント: ログアウト後の遷移先や見た目を変えたい場合はこのコンポーネントを編集する。
export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
