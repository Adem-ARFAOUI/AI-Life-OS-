import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("adem@alifeos.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({
        email,
        password,
      });
      navigate("/complete-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    alert("Google OAuth Coming Soon");
  };

  const handleForgotPassword = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  return (
    <AuthLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-white mb-2'>Welcome back</h2>
          <p className='text-slate-400'>Sign in to your Second Brain</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className='space-y-4'>
          {/* Email Field */}
          <div>
            <label className='block text-xs font-semibold text-slate-300 mb-2'>
              EMAIL
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
              placeholder='your@email.com'
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className='block text-xs font-semibold text-slate-300 mb-2'>
              PASSWORD
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='w-4 h-4 rounded bg-slate-700 border border-slate-600 cursor-pointer accent-blue-500'
              />
              <span className='text-slate-300'>Remember me</span>
            </label>
            <button
              type='button'
              onClick={handleForgotPassword}
              className='text-blue-400 hover:text-blue-300 transition-colors'
            >
              Forgot password?
            </button>
          </div>

          {resetSent && (
            <p className='text-xs text-green-400 -mt-2'>
              If an account exists for {email}, a reset link has been sent.
            </p>
          )}

          {error && <p className='text-red-400 text-sm'>{error}</p>}

          {/* Sign In Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold transition-all duration-200 mt-6'
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-slate-700'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-slate-950 text-slate-500'>or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type='button'
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className='w-full py-3 rounded-lg border border-slate-600 hover:bg-slate-800 disabled:opacity-60 text-slate-200 font-medium transition-all duration-200 flex items-center justify-center gap-2'
        >
          <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
            <path
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              fill='#4285F4'
            />
            <path
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              fill='#34A853'
            />
            <path
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              fill='#FBBC05'
            />
            <path
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
          </svg>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Sign Up Link */}
        <div className='text-center text-sm text-slate-400'>
          No account?{" "}
          <Link
            to='/register'
            className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
          >
            Create one free
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
