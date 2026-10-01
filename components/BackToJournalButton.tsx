'use client';

import { useRouter } from "next/navigation";

export default function BackToJournalButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/blog");
        }
      }}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        marginBottom: "2rem",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        fontSize: "0.72rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "#c8a96e",
        cursor: "pointer",
      }}
    >
      ← Back to journal
    </button>
  );
}
