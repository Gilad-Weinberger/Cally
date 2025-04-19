"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 overflow-hidden">
      {/* Left side - Image placeholder */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-blue-900 opacity-20 z-0"></div>
        <div className="z-10 text-center">
          <div className="mb-6 inline-block">
            <div className="w-32 h-32 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Cally
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Your AI-powered calendar assistant that helps you organize your life
            with intelligence and simplicity.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20"></div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join Cally and start organizing your schedule
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleEmailSignUp}>
            <AuthInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <AuthInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
            <div className="pt-2">
              <AuthButton
                type="submit"
                loading={loading}
                text="Sign up with Email"
              />
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <AuthButton
              type="button"
              onClick={handleGoogleSignIn}
              loading={loading}
              text="Sign up with Google"
              variant="google"
            />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
