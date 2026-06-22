export default function Badge({
  label,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
}) {
  const variantClasses = {
    primary: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    error: "bg-red-500/20 text-red-300 border-red-500/30",
    neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : 18} />}
      <span className='font-medium'>{label}</span>
    </div>
  );
}
