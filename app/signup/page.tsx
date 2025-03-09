"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    // Basic validation
    if (!name || !email || !password) {
      toast.warning("Please fill out all required fields");
      return;
    }
    
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.warning("Passwords don't match");
      return;
    }
    
    if (!agreedToTerms) {
      toast.warning("Please agree to the Terms of Service");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (res.ok) {
        toast.success("Signup successful! Please log in.");
        setTimeout(() => router.push("/login"), 2000); // Redirect after 2s
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("🔥 Signup Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      <div className="relative w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-blue-200 text-center mb-8">Join us and get started today</p>
          
          <div className="space-y-5">
            {/* Name field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                  placeholder="John Doe"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                  placeholder="name@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                  placeholder="••••••••"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-xs text-blue-300">Password must be at least 8 characters</p>
            </div>
            
            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 block">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                  placeholder="••••••••"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            {/* Terms and conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-blue-300 rounded bg-blue-900 focus:ring-3 focus:ring-blue-500"
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-blue-200">
                  I agree to the <a href="#" className="text-blue-400 hover:text-white">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-white">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            {/* Signup button */}
            <button 
              className={`w-full py-3 px-4 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
        
          </div>
          
          <p className="mt-8 text-center text-blue-200">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-white font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}