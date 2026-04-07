import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import Loader from "@/components/Loader";
import clientApi from "@/services/clientApi";

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
    const redirectToHome = () => router.replace("/home");

    const checkCookieSession = async () => {
      try {
        await clientApi.get("/users/profiles/me");
        redirectToHome();
      } catch (error) {
        // Not authenticated (or refresh failed). Stay on the login page.
      }
    };

    if (authState.loggedIn) {
      redirectToHome();
      return;
    }

    checkCookieSession();
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
      <div className="flex min-h-screen w-full items-center justify-center bg-orange-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
          <div className="w-full p-6 md:w-[65%] md:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4">
                <h1 className="text-center text-3xl font-semibold">{isLogin ? "Login" : "Sign Up"}</h1>
                {authState.isLoading && (
                  <Loader />
                )}

                <p
                  className={authState.isError ? "text-red-600" : "text-green-600"}
                >
                  {authState.message}
                </p>

                {/* Signup only fields */}
                {!isLogin && (
                  <>
                    <div className="flex w-full flex-col gap-2 sm:flex-row">
                      <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                      <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                {!isLogin && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                )}

                <button className="mt-4 w-full rounded-xl bg-black px-6 py-3 text-lg font-semibold text-white transition hover:bg-sky-700" type="submit">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex w-full items-center justify-center bg-neutral-900 p-8 md:w-[35%]">
            <div
              onClick={() => setIsLogin(!isLogin)}
              className="cursor-pointer text-center text-base font-semibold text-white transition hover:text-blue-400"
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
