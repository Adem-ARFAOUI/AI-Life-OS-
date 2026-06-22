import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

import { updateProfile } from "../services/userService";
import { useAIPlan } from "../context/AIPlanContext";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { refresh } = useAIPlan();

  const [loading, setLoading] = useState(false);

  const [age, setAge] = useState(22);

  const [country, setCountry] = useState("Tunisia");

  const [education, setEducation] = useState("Computer Science");

  const [goal, setGoal] = useState("AI Startup Founder");

  const [budget, setBudget] = useState(5000);

  const [riskTolerance, setRiskTolerance] = useState("Medium");

  const [experience, setExperience] = useState("Intermediate");

  const [timeCommitment, setTimeCommitment] = useState("20h/week");

  const [skills, setSkills] = useState("React,Node,Python,AI");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      await updateProfile({
        age,

        country,

        education,

        goal,

        budget: Number(budget),

        riskTolerance,

        experience,

        timeCommitment,

        skills: skillsArray,
      });

      // Cache locally so AIPlanContext can build the
      // POST /api/generate-plan payload from real input, then
      // immediately ask Gemini to generate a plan for it.
      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          age: Number(age),
          goal,
          goals: goal,
          budget: Number(budget),
          riskTolerance, // "Low" | "Medium" | "High" — normalized server-side
          skills: skillsArray,
        }),
      );
      await refresh();

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-slate-950 flex justify-center items-center p-6'>
      <div className='bg-slate-900 rounded-xl p-8 w-full max-w-2xl'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          Complete Your AI Profile
        </h1>

        <p className='text-slate-400 mb-8'>
          Help AI Life OS understand your future.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Age
            </label>
            <p className='text-xs text-slate-500 mb-2'>
              Helps AI estimate your career timeline.
            </p>

            <input
              type='number'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>Country</label>

            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Education
            </label>

            <input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Career Goal
            </label>
            <p className='text-xs text-slate-500 mb-2'>
              Your main ambition for the next few years.
            </p>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Available Budget ($)
            </label>
            <p className='text-xs text-slate-500 mb-2'>
              Amount you can invest in your future.
            </p>

            <input
              type='number'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Risk Tolerance
            </label>

            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Weekly Time Commitment
            </label>

            <input
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-2'>
              Skills (comma separated)
            </label>
            <p className='text-xs text-slate-500 mb-2'>
              Separate multiple skills with commas.
            </p>

            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className='w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 py-3 rounded-lg text-white font-bold'
          >
            {loading ? "Saving..." : "Save AI Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
