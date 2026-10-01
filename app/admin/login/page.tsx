import { login } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = (await searchParams) || {};
  const error = params.error === "1";
  const nextPath = params.next || "/admin/blog";

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#ede8e3", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px", border: "1px solid #1c1c1c", padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "0.9rem" }}>
          Protected area
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2rem", fontWeight: 300, marginBottom: "0.75rem" }}>
          Admin access
        </h1>
        <p style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.95rem", color: "#6b6460", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Enter the admin password to continue to the blog manager.
        </p>

        {error ? (
          <p style={{ marginBottom: "1rem", color: "#c05050", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.9rem" }}>
            Incorrect password. Please try again.
          </p>
        ) : null}

        <form action={login} style={{ display: "grid", gap: "1rem" }}>
          <input type="hidden" name="next" value={nextPath} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            style={{ padding: "0.8rem 0.9rem", background: "#080808", border: "1px solid #1c1c1c", color: "#ede8e3", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          />
          <button
            type="submit"
            style={{ padding: "0.8rem 1rem", border: "1px solid #c8a96e", background: "#c8a96e", color: "#080808", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
