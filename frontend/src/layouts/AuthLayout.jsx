import { Brain } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4'>
      {/* Logo */}
      <div className='mb-12 text-center'>
        <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4'>
          <Brain size={32} className='text-white' />
        </div>
        <h1 className='text-4xl font-bold text-white'>AI Life OS</h1>
        <p className='text-slate-400 mt-2'>Your Personal Second Brain</p>
      </div>

      {/* Content */}
      <div className='w-full max-w-md'>{children}</div>

      {/* Footer */}
      <div className='mt-12 text-center text-sm text-slate-500'>
        <p>Privacy First | Life O/D | AI-Assisted | All Life - Your Decide</p>
      </div>
    </div>
  );
}
