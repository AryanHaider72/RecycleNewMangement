// app/login/page.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import CheckAuth from "../api/Controller/Authentication/checkAuth";
import LoginApi from "../api/Controller/Authentication/loginApi";
// import LoginApi from "../api/Controller/Authentication/Login/login";
// import CheckAuth from "../api/Controller/Authentication/CheckAuth/CheckAuth";

export default function LoginPage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [activeMessage, setActiveMessage] = useState<"success" | "error">(
    "success",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");

  const Login = async () => {
    try {
      setLoading(true);
      const formData = { userName: Email, password: Password };
      const response = await LoginApi(formData);
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setShowMessage(true);
        setActiveMessage("success");
        setResponseMessage(response.data?.message);
        setUser(response.data?.status);
        const token = response.data?.token;
        localStorage.setItem("adminToken", token as string);
        window.location.href = "/AdminSetting/Dashboard";
      } else {
        setPassword("");
        setShowMessage(true);
        setActiveMessage("error");
        setResponseMessage(response.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    const response = await CheckAuth(String(token));
    if (response.status === 200) {
      window.location.href = "/AdminSetting/Dashboard";
    } else {
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);
  return (
    <>
      <>
        <div className="flex flex-col min-h-screen  items-center justify-center  sm:px-6 lg:px-8">
          <div className="w-full max-w-md border border-gray-200 space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            {/* Logo / Brand */}
            <div>
              <div className="flex flex-col justify-center item-center">
                <h1 className="text-2xl font-bold"></h1>
                <div className="flex flex-col">
                  <h2></h2>
                  <p></p>
                </div>
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                ML Recycler ERP
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                Plastic Bottle Recycling System
                <br />
                (پلاسٹک بوتل ری سائیکلنگ سسٹم)
              </p>
            </div>
            <div className="mb-1">
              <p className="font-medium">Sign In</p>
              <p className="text-sm">لاگ ان کریں</p>
            </div>

            {/* Login Form */}
            <div className="mt-5 space-y-6">
              <div className="space-y-4">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="font-medium">
                    UserName /(صارف نام)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                    placeholder="Email address"
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <label htmlFor="password" className="font-medium">
                    Password / (پاس ورڈ)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="relative block w-full rounded-lg border border-slate-300 bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {ShowMessage && (
                <div
                  className={`${
                    activeMessage === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  } rounded-lg p-3 animate-in fade-in duration-200`}
                >
                  <p
                    className={`${
                      activeMessage === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    } text-sm text-center`}
                  >
                    {responseMessage}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <div>
                <button
                  onClick={Login}
                  type="button"
                  className=" relative flex w-full border border-gray-200  justify-center rounded-lg  px-4 py-3 text-sm font-semibold text-black shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 hover:bg-gray-900 hover:text-white "
                >
                  {loading ? (
                    <div className="flex items-center gap-2 ">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span className="">Logging In...</span>
                    </div>
                  ) : (
                    "Login (لاگ اِن)"
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs">ML Recycler ERP v1.0 — Module 1</p>
        </div>
      </>
    </>
  );
}
