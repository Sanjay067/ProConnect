import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import clientApi from "@/services/clientApi";
import styles from "@/pages/login/style.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady && !token) setErr("Invalid reset link.");
  }, [router.isReady, token]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await clientApi.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      setMsg("Password updated. Redirecting to login…");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (e2) {
      setErr(e2.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <form onSubmit={submit} className={styles.cardContainer_left}>
            <h1>New password</h1>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 12, padding: 10 }}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 12, padding: 10 }}
            />
            <button type="submit" className={`btn ${styles.signUpbtn}`} disabled={loading || !token}>
              {loading ? "Saving…" : "Update password"}
            </button>
            {msg && <p style={{ color: "green" }}>{msg}</p>}
            {err && <p style={{ color: "red" }}>{err}</p>}
            <p style={{ marginTop: 16 }}>
              <Link href="/login" style={{ color: "#0a66c2" }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
