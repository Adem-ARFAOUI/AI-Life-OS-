import { Brain, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function Landing() {
  return (
    <AuthLayout>
      <div className='text-center space-y-8'>
        {/* Hero Section */}
        <div className='space-y-4'>
          <h1 className='text-5xl font-bold text-white leading-tight'>
            AI Life OS
          </h1>
          <p className='text-xl text-blue-300 font-medium'>
            Your Personal Second Brain
          </p>
          <p className='text-lg text-slate-300 leading-relaxed'>
            BUILD · SIMULATE · COMPARE · ACT
          </p>
        </div>

        {/* Tagline */}
        <div className='py-6 border-l-4 border-blue-500 pl-6 text-left'>
          <p className='text-slate-200 italic text-lg'>
            "AI Life OS doesn't live your life for you. It gives you the clarity
            to live it better."
          </p>
        </div>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Link
            to='/login'
            className='flex-1 px-8 py-4 rounded-lg border-2 border-slate-600 hover:border-slate-500 text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 hover:bg-slate-800/50'
          >
            <Play size={20} />
            Watch Demo
          </Link>
        </div>

        {/* Footer Info */}
        <div className='pt-4 space-y-2 text-sm text-slate-500'>
          <p>
            <span className='font-semibold'>Philosophy:</span> AI assists.
            Humans decide.
          </p>
          <p>Privacy First · Life O/D · AI-Assisted · All Life - Your Decide</p>
        </div>
      </div>
    </AuthLayout>
  );
}
