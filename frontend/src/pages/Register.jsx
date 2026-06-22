import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      await register({
        name,

        email,

        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white'>Create Account</h2>

          <p className='text-slate-400'>Build your AI Life OS</p>
        </div>

        <form onSubmit={handleRegister} className='space-y-4'>
          <div>
            <label className='block text-xs text-slate-300 mb-2'>NAME</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
              required
            />
          </div>

          <div>
            <label className='block text-xs text-slate-300 mb-2'>EMAIL</label>

            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
              required
            />
          </div>

          <div>
            <label className='block text-xs text-slate-300 mb-2'>
              PASSWORD
            </label>

            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
                required
              />

              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className='text-red-400'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 rounded-lg bg-blue-600 text-white font-bold'
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className='text-center text-sm text-slate-400'>
          Already have an account?{" "}
          <Link to='/login' className='text-blue-400'>
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
