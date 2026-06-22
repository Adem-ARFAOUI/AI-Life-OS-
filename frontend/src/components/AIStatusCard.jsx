import { Bot, Database, Clock, Activity } from "lucide-react";

export default function AIStatusCard({
  lastSync = "2 min ago",
  isProcessing = false,
}) {
  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-white'>AI Status</h3>
        <span
          className={`inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full ${
            isProcessing
              ? "bg-amber-500/20 text-amber-300"
              : "bg-green-500/20 text-green-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isProcessing ? "bg-amber-400 animate-pulse" : "bg-green-400"
            }`}
          />
          {isProcessing ? "Processing" : "Online"}
        </span>
      </div>

      <div className='space-y-3 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-slate-400 flex items-center gap-2'>
            <Bot size={14} /> Model
          </span>
          <span className='text-slate-200 font-medium'>Second Brain v2.4</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-slate-400 flex items-center gap-2'>
            <Database size={14} /> Data points analyzed
          </span>
          <span className='text-slate-200 font-medium'>1,248</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-slate-400 flex items-center gap-2'>
            <Clock size={14} /> Last sync
          </span>
          <span className='text-slate-200 font-medium'>{lastSync}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-slate-400 flex items-center gap-2'>
            <Activity size={14} /> Processing load
          </span>
          <span className='text-slate-200 font-medium'>
            {isProcessing ? "Elevated" : "Low"}
          </span>
        </div>
      </div>
    </div>
  );
}
