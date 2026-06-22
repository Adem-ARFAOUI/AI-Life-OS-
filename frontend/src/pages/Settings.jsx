import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, AlertTriangle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function Settings() {
  const navigate = useNavigate();

  // --- Account: email ---
  const [email, setEmail] = useState("adem@alifeos.com");
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(email);
  const [emailSaved, setEmailSaved] = useState(false);

  // --- Account: password ---
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  // --- Preferences ---
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    weeklySummary: true,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  // --- Data & Privacy ---
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleStartEditEmail = () => {
    setEmailDraft(email);
    setEmailSaved(false);
    setEditingEmail(true);
  };

  const handleSaveEmail = () => {
    if (!emailDraft.trim() || !emailDraft.includes("@")) return;
    setEmail(emailDraft.trim());
    setEditingEmail(false);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  const handleCancelEmail = () => {
    setEmailDraft(email);
    setEditingEmail(false);
  };

  const handleStartEditPassword = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSaved(false);
    setEditingPassword(true);
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setEditingPassword(false);
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleCancelPassword = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setEditingPassword(false);
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setPrefsSaved(false);
  };

  const handleSavePreferences = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const handleDownloadData = () => {
    const exportPayload = {
      account: { email },
      preferences: prefs,
      profile: {
        name: "Adem Arfaoui",
        location: "Paris, France",
        role: "Master 1 Student — Management & Data Science",
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-life-os-data-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <MainLayout>
      <div className='px-4 sm:px-8 py-8 max-w-7xl mx-auto'>
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>Settings</h1>
            <p className='text-slate-400'>
              Customize your AI Life OS experience
            </p>
          </div>

          {/* Account Settings */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>Account</h3>
            <div className='space-y-4'>
              {/* Email */}
              <div className='pb-4 border-b border-slate-700'>
                {!editingEmail ? (
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='text-white font-medium'>Email Address</p>
                      <p className='text-slate-400 text-sm'>{email}</p>
                    </div>
                    <button
                      onClick={handleStartEditEmail}
                      className='text-blue-500 hover:text-blue-400 text-sm'
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <p className='text-white font-medium'>Email Address</p>
                    <input
                      type='email'
                      value={emailDraft}
                      onChange={(e) => setEmailDraft(e.target.value)}
                      className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none transition-colors'
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={handleCancelEmail}
                        className='px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEmail}
                        className='px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors'
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                {emailSaved && (
                  <p className='text-xs text-green-400 mt-2 flex items-center gap-1'>
                    <CheckCircle size={12} /> Email updated.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                {!editingPassword ? (
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='text-white font-medium'>Password</p>
                      <p className='text-slate-400 text-sm'>
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button
                      onClick={handleStartEditPassword}
                      className='text-blue-500 hover:text-blue-400 text-sm'
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <p className='text-white font-medium'>Update Password</p>
                    <input
                      type='password'
                      placeholder='New password'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none transition-colors'
                    />
                    <input
                      type='password'
                      placeholder='Confirm new password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none transition-colors'
                    />
                    {passwordError && (
                      <p className='text-xs text-red-400'>{passwordError}</p>
                    )}
                    <div className='flex gap-2'>
                      <button
                        onClick={handleCancelPassword}
                        className='px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePassword}
                        className='px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors'
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                {passwordSaved && (
                  <p className='text-xs text-green-400 mt-2 flex items-center gap-1'>
                    <CheckCircle size={12} /> Password updated.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Preferences
            </h3>
            <div className='space-y-4'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded accent-blue-500'
                  checked={prefs.emailNotifications}
                  onChange={() => togglePref("emailNotifications")}
                />
                <div>
                  <p className='text-white font-medium'>Email Notifications</p>
                  <p className='text-slate-400 text-sm'>
                    Get updates on milestones
                  </p>
                </div>
              </label>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded accent-blue-500'
                  checked={prefs.weeklySummary}
                  onChange={() => togglePref("weeklySummary")}
                />
                <div>
                  <p className='text-white font-medium'>Weekly Summary</p>
                  <p className='text-slate-400 text-sm'>
                    Receive weekly analysis
                  </p>
                </div>
              </label>
              <label className='flex items-center gap-3 cursor-not-allowed opacity-70'>
                <input
                  type='checkbox'
                  checked
                  disabled
                  className='w-4 h-4 rounded accent-blue-500'
                />
                <div>
                  <p className='text-white font-medium'>Dark Mode</p>
                  <p className='text-slate-400 text-sm'>
                    Always enabled in this version
                  </p>
                </div>
              </label>
            </div>
            <div className='flex items-center gap-3 mt-6'>
              <button
                onClick={handleSavePreferences}
                className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors'
              >
                Save Preferences
              </button>
              {prefsSaved && (
                <p className='text-xs text-green-400 flex items-center gap-1'>
                  <CheckCircle size={12} /> Preferences saved.
                </p>
              )}
            </div>
          </div>

          {/* Data & Privacy */}
          <div className='bg-slate-900 rounded-xl p-6 border border-slate-800'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Data & Privacy
            </h3>
            <div className='space-y-3'>
              <button
                onClick={() => setShowPrivacyPolicy((v) => !v)}
                className='w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors'
              >
                View Privacy Policy
              </button>
              {showPrivacyPolicy && (
                <div className='px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300 space-y-2'>
                  <p>
                    AI Life OS stores only the data you provide directly:
                    profile details, goals, and simulator inputs. We never
                    sell your data, and all analysis runs on your declared
                    data only — no external tracking.
                  </p>
                  <p>
                    You can export or delete your data at any time from this
                    page.
                  </p>
                </div>
              )}

              <button
                onClick={handleDownloadData}
                className='w-full flex items-center justify-between px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors'
              >
                <span>Download Your Data</span>
                <Download size={16} />
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className='w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors'
                >
                  Delete Account
                </button>
              ) : (
                <div className='px-4 py-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-3'>
                  <div className='flex gap-2 items-start text-red-300'>
                    <AlertTriangle size={18} className='shrink-0 mt-0.5' />
                    <p className='text-sm'>
                      This permanently deletes your profile, twins, and
                      roadmap data. Type{" "}
                      <span className='font-semibold'>DELETE</span> to
                      confirm.
                    </p>
                  </div>
                  <input
                    type='text'
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder='Type DELETE'
                    className='w-full px-3 py-2 rounded-lg bg-slate-900 border border-red-500/30 text-white text-sm focus:border-red-500 outline-none transition-colors'
                  />
                  <div className='flex gap-2'>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                      className='px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleteConfirmText !== "DELETE" || deleting}
                      className='px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors'
                    >
                      {deleting ? "Deleting..." : "Permanently Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
