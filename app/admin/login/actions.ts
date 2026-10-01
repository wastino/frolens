"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "frolens_admin_auth";
const defaultPassword = "frolens-admin";

export async function login(formData: FormData) {
  const password = String(formData.get("password") || "").trim();
  const expectedPassword = process.env.ADMIN_PASSWORD || defaultPassword;
  const nextPath = String(formData.get("next") || "/admin/blog");

  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, expectedPassword, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    redirect(nextPath);
  }

  redirect("/admin/login?error=1");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
  redirect("/admin/login");
}
