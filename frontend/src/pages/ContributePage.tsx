import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { submitContribution } from '../services/api';
import { ContributionCreate, Contribution } from '../types';

export const ContributePage: React.FC = () => {
  const contributorToken = localStorage.getItem('parampara_contributor_token');
  const contributorUser = localStorage.getItem('parampara_contributor_user');

  const [formData, setFormData] = useState<ContributionCreate>({
    contributor_name: contributorUser || '',
    email: '',
    tradition_name: 'Warli Painting',
    region: 'West',
    location: '',
    description: '',
    cultural_significance: '',
    media_url: '',
    source_reference: '',
    consent_given: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedContribution, setSubmittedContribution] = useState<Contribution | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.consent_given) {
      setErrorMessage('You must provide explicit consent for the curation and archiving of this cultural knowledge.');
      return;
    }

    if (formData.description.trim().length < 20) {
      setErrorMessage('Please provide a detailed description (at least 20 characters) explaining the tradition.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitContribution(formData, contributorToken);
      setSubmittedContribution(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit contribution.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412] font-cinzel">
          <Send className="w-4 h-4" />
          Community Knowledge Archiving
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contribute Cultural Heritage Knowledge
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl font-sans">
          Help preserve India's living cultural traditions. Community submissions undergo editorial verification against institutional records before publication as authentic Community Voice.
        </p>
      </div>

      {/* Ethical Protocol Notice */}
      <div className="glass-card rounded-3xl p-6 space-y-2 text-xs text-amber-950 border border-amber-300 bg-amber-50/60 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm font-cinzel">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          Zero Fabrication & Ethical Publishing Protocol
        </div>
        <p className="leading-relaxed font-sans">
          In accordance with national cultural integrity standards, Parampara AR Lite never publishes unverified claims as facts. Submissions enter a strict <strong>PENDING</strong> review queue. Only verified community narratives with explicit consent become eligible for inclusion.
        </p>
      </div>

      {/* Contributor Account Prompt */}
      {contributorToken ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Logged in as <strong>{contributorUser}</strong>. This submission will be linked to your custodian profile.</span>
          </div>
          <Link to="/contributor/dashboard" className="font-bold text-emerald-800 hover:underline flex items-center gap-1">
            View My Submissions Dashboard &rarr;
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9A3412] flex-shrink-0" />
            <span>Want to track the curation review status of your submission?</span>
          </div>
          <div className="flex items-center gap-2 font-sans">
            <Link to="/contributor/login?redirect=/contribute" className="font-bold text-[#9A3412] hover:underline">
              Sign In / Register Contributor &rarr;
            </Link>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-500">or submit as guest below</span>
          </div>
        </div>
      )}

      {/* Success View */}
      {submittedContribution ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-400 p-8 sm:p-10 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900">
            Contribution Submitted for Verification
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto font-sans">
            Thank you, <strong>{submittedContribution.contributor_name}</strong>. Your documentation regarding <strong>{submittedContribution.tradition_name}</strong> has been assigned Tracking ID #{submittedContribution.id}.
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto text-xs space-y-1.5 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-500">Submission Status:</span>
              <span className="font-bold text-amber-600 uppercase tracking-wider">{submittedContribution.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Region:</span>
              <span className="font-semibold text-slate-800">{submittedContribution.region} ({submittedContribution.location})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date Received:</span>
              <span className="text-slate-800 font-mono">{new Date(submittedContribution.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedContribution(null);
                setFormData({
                  contributor_name: contributorUser || '',
                  email: '',
                  tradition_name: 'Warli Painting',
                  region: 'West',
                  location: '',
                  description: '',
                  cultural_significance: '',
                  media_url: '',
                  source_reference: '',
                  consent_given: false,
                });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              Submit Another Entry
            </button>
            {contributorToken ? (
              <Link
                to="/contributor/dashboard"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
              >
                Track in My Dashboard &rarr;
              </Link>
            ) : (
              <Link
                to="/contributor/login"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
              >
                Create Account to Track Review
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E6D5C3] p-6 sm:p-10 shadow-sm space-y-6">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 text-rose-950 p-4 rounded-2xl text-xs flex items-center gap-2 font-sans">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Contributor Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Full Contributor / Researcher Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="contributor_name"
                required
                placeholder="e.g. Ramesh V. Kadu"
                value={formData.contributor_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Contact Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="contributor@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Tradition Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Heritage Tradition <span className="text-rose-500">*</span>
              </label>
              <select
                name="tradition_name"
                value={formData.tradition_name}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] font-sans"
              >
                <option value="Warli Painting">Warli Painting (Maharashtra)</option>
                <option value="Toda Embroidery">Toda Embroidery (Tamil Nadu)</option>
                <option value="Thathera Metal Craft">Thathera Metal Craft (Punjab)</option>
                <option value="Chhau Dance">Chhau Dance (Eastern India)</option>
                <option value="Other Living Tradition">Other Living Tradition</option>
              </select>
            </div>

            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Geographic Region <span className="text-rose-500">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] font-sans"
              >
                <option value="North">North India</option>
                <option value="South">South India</option>
                <option value="East">East India</option>
                <option value="West">West India</option>
                <option value="Central">Central India</option>
                <option value="Northeast">Northeast India</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Specific Location / Village <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Dahanu, Palghar"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-cinzel">
              Detailed Description of Practice or Object <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe the craft process, performance technique, musical instruments, or community rituals in detail (minimum 20 characters)..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
            ></textarea>
          </div>

          {/* Cultural Significance */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 font-cinzel">
              Cultural & Social Significance (Optional)
            </label>
            <textarea
              name="cultural_significance"
              rows={2}
              placeholder="How does this tradition connect to local festivals, seasons, or sacred customs?"
              value={formData.cultural_significance}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Media URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Authentic Media URL (Optional)
              </label>
              <input
                type="url"
                name="media_url"
                placeholder="https://..."
                value={formData.media_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
              />
              <span className="text-[10px] text-slate-500 block font-sans">
                Must be an authentic photograph, audio field recording, or archive link.
              </span>
            </div>

            {/* Source Reference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 font-cinzel">
                Reference / Community Source Citation
              </label>
              <input
                type="text"
                name="source_reference"
                placeholder="e.g. Field documentation with Warli elders, 2026"
                value={formData.source_reference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-[#9A3412] bg-white font-sans"
              />
            </div>
          </div>

          {/* Explicit Consent Checkbox */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent_given"
                checked={formData.consent_given}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded text-[#9A3412] focus:ring-orange-400 border-slate-300"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-sans">
                <strong>Consent and Authenticity Agreement:</strong> I confirm that the submitted cultural information is authentic, ethically documented, and that appropriate community consent has been obtained. I understand it will be peer-reviewed prior to publication.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-xl shadow-orange-950/20 disabled:opacity-50 transition-all hover:scale-102 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit for Verification'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContributePage;
