import { useNavigate } from "react-router-dom";
import Badge from "./Badge";

export default function ProfileCard({
  name = "Adem Arfaoui",
  email = "adem@alifeos.com",
  location = "Paris, France",
  role = "Master 1 Student — Management & Data Science",
  institution = "Business School, Paris",
  timeHorizon = "1–2 year decision window",
  completion = 60,
  badges = ["ML Student", "Management & Data Science", "Pro Plan"],
  constraints = [
    { type: "warning", text: "Student loan repayment starts in 18 months" },
    { type: "warning", text: "Strongly prefers to remain in Europe" },
    { type: "warning", text: "Limited runway without additional funding" },
    { type: "info", text: "No co-founder identified yet" },
  ],
  onEditClick,
  showEditButton = true,
}) {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      navigate("/profile");
    }
  };

  const initial = (name || "A").trim().charAt(0).toUpperCase();

  return (
    <div className='rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6'>
      <div className='flex items-start justify-between mb-6'>
        <div>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center'>
              <span className='text-2xl font-bold text-white'>{initial}</span>
            </div>
            <div>
              <h3 className='text-2xl font-bold text-white'>{name}</h3>
              <p className='text-sm text-slate-400'>
                {email} · {location}
              </p>
            </div>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-4xl font-bold text-blue-400'>{completion}%</p>
          <p className='text-xs text-slate-400 mt-1'>Profile complete</p>
        </div>
      </div>

      {/* Badges */}
      <div className='flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-700'>
        {badges.map((label, idx) => (
          <Badge
            key={idx}
            label={label}
            variant={idx === badges.length - 1 ? "warning" : "primary"}
            size='sm'
          />
        ))}
      </div>

      {/* Current Situation */}
      <div className='mb-6'>
        <h4 className='text-sm font-semibold text-white mb-3'>
          Current Situation
        </h4>
        <div className='space-y-3 text-sm text-slate-300'>
          <div>
            <p className='text-slate-400 text-xs mb-1'>Role</p>
            <p className='font-medium'>{role}</p>
          </div>
          <div>
            <p className='text-slate-400 text-xs mb-1'>Institution</p>
            <p className='font-medium'>{institution}</p>
          </div>
          <div>
            <p className='text-slate-400 text-xs mb-1'>Location</p>
            <p className='font-medium'>{location} (Europe-only preference)</p>
          </div>
          <div>
            <p className='text-slate-400 text-xs mb-1'>Time Horizon</p>
            <p className='font-medium'>{timeHorizon}</p>
          </div>
        </div>
      </div>

      {/* Major Constraints */}
      <div>
        <h4 className='text-sm font-semibold text-white mb-3'>
          Major Constraints
        </h4>
        <div className='space-y-2'>
          {constraints.map((c, idx) => (
            <div key={idx} className='flex gap-2 items-start'>
              <span
                className={`text-lg ${c.type === "warning" ? "text-amber-400" : "text-slate-500"}`}
              >
                {c.type === "warning" ? "⚠️" : "ℹ️"}
              </span>
              <p className='text-sm text-slate-300'>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {showEditButton && (
        <button
          onClick={handleEdit}
          className='mt-6 w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200'
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
