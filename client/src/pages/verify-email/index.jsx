import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import clientApi from "@/services/clientApi";
import styles from "@/pages/login/style.module.css";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [msg, setMsg] = useState("Verifying…");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!router.isReady || !token) return undefined;
    clientApi
      .get("/auth/verify-email", { params: { token } })
      .then(({ data }) => setMsg(data.message || "Verified."))
      .catch((e) => setErr(e.response?.data?.message || "Verification failed."));
    return undefined;
  }, [router.isReady, token]);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <h1>Email verification</h1>
            {!token && router.isReady && (
              <p style={{ color: "red" }}>Missing token in URL.</p>
            )}
            {err && <p style={{ color: "red" }}>{err}</p>}
            {!err && msg && <p style={{ color: "green" }}>{msg}</p>}
            <p style={{ marginTop: 24 }}>
              <Link href="/login" style={{ color: "#0a66c2" }}>
                Go to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
