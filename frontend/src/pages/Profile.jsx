import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProfileCard from "../components/ProfileCard";
import { getProfile, updateProfile } from "../services/userService";
import { useAIPlan } from "../context/AIPlanContext";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  age: "",
  country: "",
  education: "",
  goal: "",
  budget: "",
  skills: "",
  experience: "",
  riskTolerance: "",
  timeCommitment: "",
};

export default function Profile() {
  // `profile` is the saved/committed data shown in view mode.
  // `formData` is the draft being edited; it is only copied back into
  // `profile` when the user explicitly saves.
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [formData, setFormData] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedNotice, setShowSavedNotice] = useState(false);
  const { refresh } = useAIPlan();

  // Keeps the localStorage cache that AIPlanContext reads from in
  // sync with whatever profile data we actually have (string skills
  // are normalized to an array; riskTolerance is kept as the
  // Low/Medium/High label, normalized server-side).
  const cacheProfileForAI = (data) => {
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        name: data.name,
        age: Number(data.age) || 22,
        goal: data.goal,
        goals: data.goal,
        budget: Number(data.budget) || 5000,
        riskTolerance: data.riskTolerance,
        skills: Array.isArray(data.skills)
          ? data.skills
          : (data.skills || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      }),
    );
  };

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user);
      setFormData(data.user);
      cacheProfileForAI(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => {
    // Always start editing from the last saved state, not from
    // whatever was left over in formData from a previous, cancelled edit.
    setFormData(profile);
    setShowSavedNotice(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setProfile(formData);
      cacheProfileForAI(formData);
      setIsEditing(false);
      setShowSavedNotice(true);
      refresh();
      setTimeout(() => {
        setShowSavedNotice(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // Restore values: discard the draft and fall back to the saved profile.
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex flex-wrap justify-between items-start gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>
                Your Profile
              </h1>
              <p className='text-slate-400'>
                Manage your personal information and settings
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors'
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Saved confirmation */}
          {showSavedNotice && (
            <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm'>
              <CheckCircle size={18} />
              Profile changes saved.
            </div>
          )}

          {/* Profile Content */}
          {!isEditing ? (
            // View Mode
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <ProfileCard
                  name={profile.name}
                  email={profile.email}
                  age={profile.age}
                  country={profile.country}
                  education={profile.education}
                  goal={profile.goal}
                  onEditClick={handleEditClick}
                />
              </div>

              {/* Additional Info */}
              <div className='bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Profile Insights
                </h3>
                <div>
                  <p className='text-sm text-slate-400 mb-1'>Completion</p>
                  <div className='w-full bg-slate-800 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full'
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <p className='text-xs text-slate-500 mt-1'>65% complete</p>
                </div>
                <div>
                  <p className='text-sm text-slate-400 mb-2'>Skills</p>
                  <p className='text-sm text-slate-200'>{profile.skills}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-400 mb-2'>Budget</p>
                  <p className='text-sm text-slate-200'>{profile.budget}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-400 mb-2'>Experience</p>
                  <p className='text-sm text-slate-200'>{profile.experience}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-400 mb-2'>Recent Updates</p>
                  <p className='text-xs text-slate-400'>
                    Last updated 2 days ago
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className='bg-slate-900 rounded-xl p-8 border border-slate-800 max-w-3xl'>
              <h3 className='text-2xl font-semibold text-white mb-6'>
                Edit Profile
              </h3>

              <div className='space-y-6'>
                {/* Personal Info */}
                <div className='border-b border-slate-700 pb-6'>
                  <h4 className='text-lg font-semibold text-white mb-4'>
                    Personal Information
                  </h4>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Email
                      </label>
                      <input
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Age
                      </label>

                      <input
                        type='number'
                        value={formData.age}
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Country
                      </label>

                      <input
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white'
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className='border-b border-slate-700 pb-6'>
                  <h4 className='text-lg font-semibold text-white mb-4'>
                    Professional Background
                  </h4>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Education
                      </label>
                      <input
                        value={formData.education}
                        onChange={(e) =>
                          handleInputChange("education", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Years of Experience
                      </label>
                      <input
                        type='text'
                        value={formData.experience}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Goals */}
                <div className='border-b border-slate-700 pb-6'>
                  <h4 className='text-lg font-semibold text-white mb-4'>
                    Skills & Goals
                  </h4>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Key Skills
                      </label>
                      <textarea
                        value={formData.skills}
                        onChange={(e) =>
                          handleInputChange("skills", e.target.value)
                        }
                        rows='3'
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Budget
                      </label>
                      <input
                        type='text'
                        value={formData.budget}
                        onChange={(e) =>
                          handleInputChange("budget", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Career Goal
                      </label>
                      <input
                        type='text'
                        value={formData.goal}
                        onChange={(e) =>
                          handleInputChange("goal", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Risk Tolerance
                      </label>
                      <select
                        value={formData.riskTolerance}
                        onChange={(e) =>
                          handleInputChange("riskTolerance", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      >
                        <option value=''>Select risk tolerance</option>
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                      </select>
                    </div>
                    <div>
                      <label className='text-sm text-slate-400 mb-2 block'>
                        Time Commitment
                      </label>
                      <input
                        type='text'
                        value={formData.timeCommitment}
                        onChange={(e) =>
                          handleInputChange("timeCommitment", e.target.value)
                        }
                        className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none transition-colors'
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={handleCancel}
                    className='px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors'
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
