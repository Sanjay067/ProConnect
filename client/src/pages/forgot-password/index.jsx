import React, { useState } from "react";
import Link from "next/link";
import UserLayout from "@/layout/UserLayout";
import clientApi from "@/services/clientApi";
import styles from "@/pages/login/style.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const { data } = await clientApi.post("/auth/forgot-password", { email });
      setMsg(data.message || "Check your email.");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <form onSubmit={submit} className={styles.cardContainer_left}>
            <h1>Reset password</h1>
            <p>We&apos;ll email you a link if an account exists.</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", marginTop: 12, padding: 10 }}
            />
            <button type="submit" className={`btn ${styles.signUpbtn}`} disabled={loading}>
              {loading ? "Sending…" : "Send link"}
            </button>
            {msg && <p style={{ color: "green" }}>{msg}</p>}
            {err && <p style={{ color: "red" }}>{err}</p>}
            <p style={{ marginTop: 16 }}>
              <Link href="/login" style={{ color: "#0a66c2" }}>
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
