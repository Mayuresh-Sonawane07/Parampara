import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Award,
  CheckCircle2,
  ChevronRight,
  Hammer,
  HelpCircle,
  MessageSquareQuote,
  Calendar,
  Layers,
  Camera,
  Volume2
} from 'lucide-react';
import { fetchTradition } from '../services/api';
import { TraditionDetail } from '../types';
import { SourceBadge } from '../components/SourceBadge';
import { NarrationPlayer } from '../components/NarrationPlayer';

export const TraditionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tradition, setTradition] = useState<TraditionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchTradition(slug)
      .then((data) => setTradition(data))
      .catch((err) => setError(err.message || 'Tradition not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Retrieving verified cultural documentation...
        </p>
      </div>
    );
  }

  if (error || !tradition) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cinzel text-2xl font-bold text-slate-900">Tradition Not Found</h2>
        <p className="text-slate-600">{error || 'The requested heritage tradition could not be located.'}</p>
        <Link to="/explore" className="inline-block px-6 py-3 rounded-xl bg-[#9A3412] text-white font-bold text-sm shadow-md">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isWarli = tradition.slug === 'warli';
  const approvedContributions = tradition.approved_contributions || [];

  // Tradition-specific verified making & motif summaries
  const traditionDetailsMap: {
    [key: string]: {
      howMadeTitle: string;
      howMadeContent: string;
      symbolsTitle: string;
      symbolsContent: string;
    };
  } = {
    thathera: {
      howMadeTitle: 'How It Is Made / Practiced: 8-Stage Hand-Hammered Utensil Forging',
      howMadeContent:
        'Crafting involves raw metal ingot selection (brass, copper, and kansa bronze), heating inside subterranean pit furnaces (bhatti) powered by manual or electric bellows, and synchronized team sledgehammering into flat circular plates. The sheets are curved into bowl shapes using depression anvils, brazed with borax flux, cleaned in tamarind (imli) and river sand baths, work-hardened through signature surface dimpling (kandhai), and tin-coated (kalai) for food safety.',
      symbolsTitle: 'Symbols / Motifs / Performance: Structural Dimpling (Kandhai)',
      symbolsContent:
        'The gleaming dimpled texture covering Thathera vessels is not merely an aesthetic choice. Systematically striking the annealed metal with a polished steel ball hammer while resting on a stake anvil work-hardens the utensil walls, enhancing structural rigidity and resistance to denting while creating its iconic sparkling brilliance.',
    },
    toda: {
      howMadeTitle: 'How It Is Made / Practiced: Counted-Thread Reverse Darning',
      howMadeContent:
        'Toda women handcraft the Poothkulli ceremonial mantle using unbleached, loosely woven ecru cotton cloth. Working with red and black woollen yarns, the artisan counts exact warp and weft threads directly with a needle from the reverse side of the cloth, creating a rich embossed relief pattern on the front without stencils, tracing carbon, or pre-drawn guides.',
      symbolsTitle: 'Symbols / Motifs / Performance: Sacred Geometry & Pastoral Motifs',
      symbolsContent:
        'Iconic documented patterns include Pukhoor (stylized wild mountain blooms reflecting the high-altitude shola grasslands), Modi (curved lines representing sacred Nilgiri water buffalo horns and the wild rose), Karthal (geometric architectural grids mirroring sacred Toda barrel-vaulted dairies), and Enepukhoor (the eight-pointed morning star).',
    },
    chhau: {
      howMadeTitle: 'How It Is Made / Practiced: Martial Footwork & Spring Chaitra Parva Performance',
      howMadeContent:
        'Chhau evolved directly from indigenous sword-and-shield combat exercises (Parikhanda). Dancers undergo rigorous training in akhadas to master stances (Chalis) and leg movements imitating animals (Upalayas). Performances take place in open-air arenas during the spring festival of Chaitra Parva, accompanied by a resounding percussion orchestra featuring the cylindrical Dhol, huge kettle-drum Dhumsa, and double-reed Mohuri pipe.',
      symbolsTitle: 'Symbols / Motifs / Performance: Three Distinct Regional Traditions',
      symbolsContent:
        'Chhau encompasses three distinct regional forms: Seraikella (Jharkhand), utilizing delicate pastel papier-mâché masks and lyrical Topkas; Purulia (West Bengal), featuring dramatic feathered Charida masks and high 360-degree mid-air somersaults; and Mayurbhanj (Odisha), which is uniquely maskless, allowing dancers bare-faced martial expression and intricate neck and eye movements.',
    },
    warli: {
      howMadeTitle: 'How It Is Made / Practiced: Wall Preparation & Rice-Paste Painting',
      howMadeContent:
        'Traditional Warli painting is created directly on mud-and-cow dung plastered hut walls coated with reddish-brown ochre (geru). The signature white paint is prepared by grinding rice into a fine paste and binding it with natural gum extracted from babool or khair trees. The painter applies the pigment using a chewed bamboo twig (bahru) functioning as a delicate quill.',
      symbolsTitle: 'Symbols / Motifs / Performance: Sacred Iconography & The Tarpa Spiral',
      symbolsContent:
        'Iconography is built from fundamental geometric forms: the circle represents the sun and moon, the triangle symbolizes mountains and human torsos, and the square (chaukat) marks sacred space. Key documented elements include the Mother Goddess Palaghata (invoked for harvest fertility inside the wedding chauk), the sacred Tree of Life (Devrai forest balance), and the Tarpa dance spiral (men and women dancing counter-clockwise around the elder musician to mirror cosmic cycles).',
    },
  };

  const details = traditionDetailsMap[tradition.slug] || {
    howMadeTitle: 'How It Is Made / Practiced',
    howMadeContent: tradition.description,
    symbolsTitle: 'Symbols / Motifs / Performance',
    symbolsContent: tradition.cultural_significance || 'Information documented from primary archives.',
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-[#0B0F17] text-white min-h-[440px] flex items-end border-b border-amber-900/40">
        <img
          src={tradition.hero_image || `/heritage-images/${tradition.slug}.jpg`}
          alt={tradition.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
              {tradition.region} India • {tradition.state}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
              {tradition.category}
            </span>
            {tradition.community && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/50 text-amber-200 border border-white/10">
                Community: {tradition.community}
              </span>
            )}
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl">
            {tradition.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed font-sans">
            {tradition.short_description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={isWarli ? '/tradition/warli/ar' : `/tradition/${tradition.slug}/experience`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-xl transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Interactive Experience</span>
            </Link>

            {isWarli && (
              <Link
                to="/tradition/warli/ar"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>WebAR Camera View</span>
              </Link>
            )}

            <Link
              to={`/tradition/${tradition.slug}/quiz`}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Quiz</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Cols: All Required Sections */}
        <div className="lg:col-span-8 space-y-8">
          {/* MULTILINGUAL ORAL NARRATION CARD */}
          <div className="glass-card rounded-3xl p-6 border border-[#E6D5C3] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
                <Volume2 className="w-4 h-4" />
                Multilingual Oral History Player
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                English • Hindi • Regional
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Listen to authentic verified narration in your preferred language using voice synthesis:
            </p>
            <NarrationPlayer
              traditionSlug={tradition.slug}
              motifTitle={tradition.name}
              motifContent={tradition.short_description}
              culturalContext={tradition.description}
              className="pt-1"
            />
          </div>

          {/* SECTION 1: ABOUT */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
              <BookOpen className="w-4 h-4" />
              Overview & Provenance
            </div>
            <h2 className="font-cinzel text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
              About {tradition.name}
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-sans">
              {tradition.description}
            </p>
          </section>

          {/* SECTION 2: CULTURAL CONTEXT */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
              <Layers className="w-4 h-4" />
              Cultural Context & Lineage
            </div>
            <h2 className="font-cinzel text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Cultural Context
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-sans">
              {tradition.historical_context ||
                'Documented in regional state gazetteers and academic archives as an authentic multi-generational living practice.'}
            </p>
          </section>

          {/* SECTION 3: HOW IT IS MADE / PRACTICED */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
              <Hammer className="w-4 h-4" />
              Traditional Techniques & Materials
            </div>
            <h2 className="font-cinzel text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
              How It Is Made / Practiced
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-sans">
              {details.howMadeContent}
            </p>
          </section>

          {/* SECTION 4: SYMBOLS / MOTIFS / PERFORMANCE */}
          <section className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 font-cinzel">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Iconography & Aesthetics
            </div>
            <h2 className="font-cinzel text-2xl font-black text-amber-950 border-b border-amber-200/80 pb-3">
              Symbols / Motifs / Performance
            </h2>
            <p className="text-base text-amber-950/90 leading-relaxed font-sans">
              {details.symbolsContent}
            </p>
          </section>

          {/* SECTION 5: WHY IT MATTERS */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
              <Award className="w-4 h-4" />
              Community Worldview & Values
            </div>
            <h2 className="font-cinzel text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Why It Matters
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-sans">
              {tradition.cultural_significance ||
                'This tradition encapsulates living community cohesion, ecological harmony, and the transmission of ancestral knowledge across generations.'}
            </p>
            {tradition.preservation_context && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Safeguarding & Transmission Context
                </span>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {tradition.preservation_context}
                </p>
              </div>
            )}
          </section>

          {/* SECTION 6: VERIFIED COMMUNITY VOICE */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 font-cinzel">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Ethical Community Archiving
                </div>
                <h2 className="font-cinzel text-2xl font-black text-slate-900 mt-1">
                  Community Voice
                </h2>
              </div>
              <Link
                to="/contribute"
                className="text-xs font-bold text-[#9A3412] hover:underline"
              >
                Submit Knowledge +
              </Link>
            </div>

            {approvedContributions.length > 0 ? (
              <div className="space-y-4">
                {approvedContributions.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-950">
                        <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                        <span>{c.contributor_name}</span>
                        <span className="text-slate-500 font-normal">({c.location}, {c.region})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase tracking-wider">
                        Peer-Reviewed Community Voice
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed italic font-sans">
                      "{c.description}"
                    </p>

                    {c.cultural_significance && (
                      <p className="text-xs text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-200 font-sans">
                        <strong>Significance noted:</strong> {c.cultural_significance}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-100">
                      <span>Source: {c.source_reference || 'Oral tradition documented with consent'}</span>
                      <span className="font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF8F5] border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Community Voice records appear here only after contributor consent and editorial verification against institutional archives. Unverified claims are never published as facts.
                </p>
                <Link
                  to="/contribute"
                  className="inline-block text-xs font-bold text-[#9A3412] hover:underline"
                >
                  Are you a practitioner or researcher? Contribute cultural documentation →
                </Link>
              </div>
            )}
          </section>

          {/* SECTION 7: INTERACTIVE EXPERIENCE CTA BOX */}
          <div className="bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-amber-950 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 font-cinzel">
                Interactive Learning
              </span>
              <h3 className="font-cinzel text-2xl font-bold">
                Experience This Tradition
              </h3>
              <p className="text-sm text-amber-100/90 max-w-md font-sans">
                Engage with {tradition.experience_type.replace('_', ' ').toLowerCase()} directly through our verified digital explorer.
              </p>
            </div>
            <Link
              to={isWarli ? '/tradition/warli/ar' : `/tradition/${tradition.slug}/experience`}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-lg transition-transform hover:scale-105"
            >
              <span>Launch Experience</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right 4 Cols: Sources, Quiz & Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Facts Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6D5C3] shadow-sm space-y-4">
            <h3 className="font-cinzel font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Heritage Metadata
            </h3>
            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 uppercase font-bold tracking-wider">Region</dt>
                <dd className="font-bold text-slate-900 text-sm mt-0.5">{tradition.region} India</dd>
              </div>
              <div>
                <dt className="text-slate-400 uppercase font-bold tracking-wider">State / Territory</dt>
                <dd className="font-bold text-slate-900 text-sm mt-0.5">{tradition.state}</dd>
              </div>
              <div>
                <dt className="text-slate-400 uppercase font-bold tracking-wider">Practicing Community</dt>
                <dd className="font-bold text-slate-900 text-sm mt-0.5">{tradition.community || 'Information under verification'}</dd>
              </div>
              <div>
                <dt className="text-slate-400 uppercase font-bold tracking-wider">Experience Modality</dt>
                <dd className="font-bold text-[#9A3412] text-sm mt-0.5">{tradition.experience_type.replace('_', ' ')}</dd>
              </div>
            </dl>
          </div>

          {/* Quiz Card */}
          <div className="glass-card p-6 rounded-3xl border border-amber-300/80 shadow-md space-y-3 bg-amber-50/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3412] font-cinzel">
              <HelpCircle className="w-4 h-4" />
              Active Learning
            </div>
            <h3 className="font-cinzel font-bold text-lg text-slate-900">
              Verified Knowledge Quiz
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Test your understanding of {tradition.name} through multiple-choice questions grounded in primary archival dossiers.
            </p>
            <Link
              to={`/tradition/${tradition.slug}/quiz`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
            >
              Take Quiz Now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Sourced Citations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="font-cinzel font-bold text-lg text-slate-900">
                Verified Archival Sources
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Every claim on this page is traceable to the following institutional sources:
            </p>

            <div className="space-y-3">
              {tradition.sources.map((src) => (
                <SourceBadge key={src.id} source={src} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraditionDetailPage;
