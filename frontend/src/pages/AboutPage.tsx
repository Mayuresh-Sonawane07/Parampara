import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Award, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] flex items-center gap-1.5 font-cinzel">
          <span className="text-base">🪷</span>
          National Living Heritage Initiative
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About Parampara AR Lite
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
          Tagline: <strong>SCAN • DISCOVER • PRESERVE</strong> • Connecting physical traditions with digital discovery.
        </p>
      </div>

      {/* Problem & Vision */}
      <div className="bg-white rounded-3xl border border-[#E6D5C3] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="font-cinzel text-2xl font-black text-slate-900 border-b border-slate-100 pb-2">
          The Challenge & Our Solution
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          India's intangible cultural heritage—spanning traditional metallurgy, counted-thread textile embroidery, martial dance-theatre, and sacred tribal iconography—is frequently presented in static museum display cases or fragmented online repositories with little provenance.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          <strong>Parampara AR Lite</strong> bridges the physical and digital world. Through single, printable QR posters on physical exhibits, visitors enter dedicated, research-backed digital experiences. Open-source WebAR lets smartphones recognize authentic artworks without requiring paid proprietary apps, making cultural heritage universally accessible.
        </p>
      </div>

      {/* Core Non-Negotiable Tenets */}
      <div className="space-y-5">
        <h2 className="font-cinzel text-2xl font-black text-slate-900">
          Engineering & Heritage Integrity Tenets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm font-cinzel">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Zero Mock / Fabricated Data
            </div>
            <p className="text-xs text-emerald-950/90 leading-relaxed font-sans">
              Every cultural description, date, tool name, and symbol interpretation is sourced directly from UNESCO, Geographical Indications registry of India, and INTACH field research. Undocumented claims are omitted or marked "under verification".
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm font-cinzel">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              2. Ethical Community Protocol
            </div>
            <p className="text-xs text-amber-950/90 leading-relaxed font-sans">
              We never fabricate local voices or artisan quotes. Community submissions are queued under PENDING status and published as Community Voice only following explicit contributor consent and editorial verification.
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm font-cinzel">
              <Award className="w-4 h-4 text-blue-600" />
              3. Diverse Regional Modalities
            </div>
            <p className="text-xs text-blue-950/90 leading-relaxed font-sans">
              Different traditions require tailored digital experiences: Thathera has an 8-stage Craft Journey; Toda features a counted-thread Motif Explorer; Chhau has a 3-style Performance Explorer; Warli features flagship WebAR.
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 p-6 rounded-3xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-purple-900 text-sm font-cinzel">
              <HeartHandshake className="w-4 h-4 text-purple-600" />
              4. 100% Free-Tier Architecture
            </div>
            <p className="text-xs text-purple-950/90 leading-relaxed font-sans">
              Deployable at ₹0 cost using open-source tools: FastAPI, SQLite/PostgreSQL, React/Vite, client-side WebAR, and open-source QR generation without paid SaaS dependencies.
            </p>
          </div>
        </div>
      </div>

      {/* Explore CTA */}
      <div className="bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-amber-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold">Ready to Experience Parampara?</h3>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 font-sans">Explore all four living regional heritage traditions now.</p>
        </div>
        <Link
          to="/explore"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all hover:scale-102"
        >
          <span>Explore Traditions</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
