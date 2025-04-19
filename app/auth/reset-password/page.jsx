'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err.code) || 'An error occurred. Please try again');
    } finally {
      setLoading(false);
    }
  };

  function getErrorMessage(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
        return "No account found with this email";
      default:
        return "An error occurred. Please try again";
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 overflow-hidden">
      {/* Left side - Image placeholder */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-blue-900 opacity-20 z-0"></div>
        <div className="z-10 text-center">
          <div className="mb-6 inline-block">
            <div className="w-32 h-32 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Reset Password</h2>
          <p className="text-blue-100 text-lg max-w-md">
            We'll help you get back into your account with our AI-powered password recovery system.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20"></div>
      </div>
      
      {/* Right side - Reset password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>
          
          {success ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md text-green-700 text-center">
                <p className="font-medium">Password reset email sent!</p>
                <p className="text-sm mt-1">Check your inbox for instructions to reset your password.</p>
              </div>
              <div className="text-center">
                <Link href="/auth/signin" className="inline-block text-indigo-600 hover:text-indigo-500 font-medium">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <AuthInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">{error}</div>
              )}

              <div className="pt-2">
                <AuthButton
                  type="submit"
                  loading={loading}
                  text="Send Reset Link"
                />
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}