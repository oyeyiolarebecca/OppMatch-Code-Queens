import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Save,
  CheckCircle,
  Sparkles,
  UploadCloud,
  FileText,
  GraduationCap,
  MapPin,
  Briefcase,
  Layers,
  Globe,
  Plus,
  X,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  const { updateProfile, isDemoMode } = useAuth();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cvExtractModalOpen, setCvExtractModalOpen] = useState(false);
  const [cvPasteText, setCvPasteText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const handleExtractFromCV = () => {
    setIsExtracting(true);
    setTimeout(() => {
      // Intelligent mock extraction
      const extractedSkills = ['TypeScript', 'Tailwind CSS', 'Next.js', 'Git', 'REST APIs'];
      const combinedSkills = Array.from(new Set([...formData.skills, ...extractedSkills]));

      setFormData((prev) => ({
        ...prev,
        skills: combinedSkills,
        education: 'undergraduate',
        school: prev.school || 'University of Lagos (UNILAG)',
        country: prev.country || 'Nigeria',
        experience: 'Completed 1 frontend internship at local tech hub; built 3 open-source React web apps.',
      }));

      setIsExtracting(false);
      setCvExtractModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Personalized Matching Profile
            </span>
            {isDemoMode && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                Demo Persona
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Candidate Profile &amp; Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            The OppMatch engine uses these fields for multivariate scoring, transparent why-you-match bullets, and gap detection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCvExtractModalOpen(true)}
          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Extract from CV</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Profile successfully updated! Matches are recalculated instantly.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Core Identity */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Country of Residence
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden bg-slate-50 cursor-pointer"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Egypt">Egypt</option>
                <option value="South Africa">South Africa</option>
                <option value="Other African Country">Other African Country</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Location / City
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Lagos, Nigeria"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Education & Career */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            2. Academic &amp; Career Level
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Education Level
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value as any })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden bg-slate-50 cursor-pointer"
              >
                <option value="undergraduate">Undergraduate Student</option>
                <option value="university">University</option>
                <option value="graduate">Postgraduate / Graduate</option>
                <option value="bootcamp">Bootcamp Graduate</option>
                <option value="self_taught">Self-Taught Developer</option>
                <option value="high_school">High School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School / University Institution
              </label>
              <input
                type="text"
                value={formData.school || ''}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g. University of Lagos (UNILAG)"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Career Level
              </label>
              <select
                value={formData.career_level}
                onChange={(e) => setFormData({ ...formData, career_level: e.target.value as any })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden bg-slate-50 cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="experienced">Experienced (3+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remote Preference
              </label>
              <select
                value={formData.remote_preference}
                onChange={(e) =>
                  setFormData({ ...formData, remote_preference: e.target.value as 'remote' | 'onsite' | 'both' })
                }
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden bg-slate-50 cursor-pointer"
              >
                <option value="both">Both Remote &amp; In-Person</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-Site Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Tag Editor */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            3. Technical &amp; Professional Skills
          </h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-lg text-xs font-semibold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-teal-600 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill (e.g. 'Python', 'Figma', 'FastAPI')..."
              className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Interests & Goals Tag Editor */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            4. Opportunity Goals &amp; Interests
          </h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {formData.interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-semibold"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="text-purple-600 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest();
                }
              }}
              placeholder="Add an interest (e.g. 'Social Impact', 'Frontend', 'Hackathons')..."
              className="flex-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Interest</span>
            </button>
          </div>
        </div>

        {/* Experience Summary */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            Short Background &amp; Current Projects Summary
          </label>
          <textarea
            rows={3}
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="Tell us about your campus projects, hackathon wins, or internship goals..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile &amp; Recalculate Matches</span>
          </button>
        </div>
      </form>

      {/* Extract From CV Modal */}
      {cvExtractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Extract Profile from CV
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCvExtractModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste your resume text below or click &quot;Extract from Sample CV&quot; to auto-populate your skills, education, institution, and career level.
            </p>

            <textarea
              rows={5}
              value={cvPasteText}
              onChange={(e) => setCvPasteText(e.target.value)}
              placeholder="Paste CV text here, or leave blank to use the sample resume..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden font-mono"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCvExtractModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExtracting}
                onClick={handleExtractFromCV}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isExtracting ? 'Extracting...' : 'Auto-Extract Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
