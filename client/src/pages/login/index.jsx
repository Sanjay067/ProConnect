import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import UserLayout from "@/Layout/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/action/authAction";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(false);

  //  Single form state
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //  Redirect after login (and handle hard refreshes)
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    } else {
      // If Redux is empty (like after a hard refresh), check if a valid cookie still exists!
      const checkCookieSession = async () => {
        try {
          await clientApi.get("/users/profiles/me");
          // If this succeeds, the cookie is active! Bye bye login page.
          router.push("/dashboard");
        } catch (error) {
          // Token is dead or missing, stay here.
        }
      };
      checkCookieSession();
    }
  }, [authState.loggedIn, router]);

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser(form));
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <h1>{isLogin ? "Login" : "Sign Up"}</h1>
                {authState.isLoading && (
                  <img src="/spin-loader.gif" alt="Loading..." width={40} />
                )}

                <p
                  style={{
                    color: authState.isError ? "red" : "green",
                  }}
                >
                  {authState.message}
                </p>

                {/* Signup only fields */}
                {!isLogin && (
                  <>
                    <div className={styles.inputRow}>
                      <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                      <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {!isLogin && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}

                <button className={`btn ${styles.signUpbtn}`} type="submit">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.cardContainer_right}>
            <div
              onClick={() => setIsLogin(!isLogin)}
              className={styles.loginLink}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
