import { redirect } from "next/navigation";

import { findUser } from "@/lib/mock-store";
import { getSessionUserId } from "@/lib/session";

export default async function HomePage() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = findUser(userId);

  if (!user) {
    redirect("/login");
  }

  redirect(user.id === "admin" ? "/admin" : "/dashboard");
}
