import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Layers,
  CheckCircle2,
  Volume2,
  VolumeX,
  Camera,
  Play,
  Share2,
  MapPin,
  Flame,
  Feather,
  Music,
  Brush
} from 'lucide-react';
import { fetchTraditions } from '../services/api';
import { TraditionSummary } from '../types';
import { speakCulturalNarration, stopCulturalNarration } from '../services/narration';

export const HomePage: React.FC = () => {
  const [traditions, setTraditions] = useState<TraditionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeZone, setActiveZone] = useState<'north' | 'south' | 'east' | 'west'>('west');
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchTraditions()
      .then((data) => setTraditions(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    return () => {
      stopCulturalNarration();
    };
  }, []);

  const zoneDetails = {
    north: {
      slug: 'thathera',
      name: 'Thathera Brass & Copper Craft',
      region: 'North India',
      state: 'Punjab (Jandiala Guru)',
      community: 'Thathera Artisan Guild',
      category: 'Inscribed UNESCO ICH Metal Craft',
      tag: 'UNESCO Intangible Cultural Heritage',
      icon: Flame,
      summary:
        'The historic craft of manufacturing hand-hammered brass, copper, and kansa bronze utensils. Practiced by the Thatheras since the 19th century under Maharaja Ranjit Singh, featuring signature surface dimpling (kandhai) that work-hardens metal walls.',
      experienceTitle: '8-Stage Craft Journey',
      experienceLink: '/tradition/thathera/experience',
      image: '/heritage-images/thathera.jpg',
      audioText:
        'Thathera Metal Craft. Located in Jandiala Guru, Punjab. Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2014. Artisans manually forge and work-harden brass and copper sheets using signature dimpling hammers.'
    },
    south: {
      slug: 'toda',
      name: 'Toda Poothkulli Embroidery',
      region: 'South India',
      state: 'Tamil Nadu (Nilgiri Hills)',
      community: 'Toda Pastoral Community',
      category: 'Geographical Indication (GI) Textile',
      tag: 'GI Tag Registered (GI-216)',
      icon: Feather,
      summary:
        'A sacred counted-thread reverse darning technique handcrafted by Toda pastoral women on unbleached ecru cotton mantles without stencils or pre-drawn patterns. Features symbolic red and black woollen motifs inspired by sacred buffaloes and Nilgiri flowers.',
      experienceTitle: 'Counted-Thread Motif Explorer',
      experienceLink: '/tradition/toda/experience',
      image: '/heritage-images/toda.jpg',
      audioText:
        'Toda Poothkulli Embroidery. Handcrafted exclusively by Toda women in the high Nilgiri grasslands of Tamil Nadu. Handwoven on coarse ecru cotton using red and black woollen yarn with precise thread-counting from the reverse side.'
    },
    east: {
      slug: 'chhau',
      name: 'Chhau Dance & Martial Masks',
      region: 'East India',
      state: 'Jharkhand, West Bengal & Odisha',
      community: 'Chhau Akhada Performers',
      category: 'Inscribed UNESCO ICH Dance Tradition',
      tag: 'UNESCO Intangible Cultural Heritage',
      icon: Music,
      summary:
        'A vibrant martial dance tradition celebrating spring (Chaitra Parva). Encompasses three distinct regional styles: Seraikella (subtle masks), Purulia (heroic feathered masks & acrobatic leaps), and Mayurbhanj (expressive maskless martial arts).',
      experienceTitle: '3-Style Performance Explorer',
      experienceLink: '/tradition/chhau/experience',
      image: '/heritage-images/chhau.jpg',
      audioText:
        'Chhau Dance. Inscribed on the UNESCO Representative List of Intangible Cultural Heritage in 2010. Performed during the spring Chaitra Parva festival, combining indigenous martial combat exercises, mock combats, and animal postures.'
    },
    west: {
      slug: 'warli',
      name: 'Warli Sacred Wall Art & WebAR',
      region: 'West India',
      state: 'Maharashtra (Sahyadri Foothills)',
      community: 'Warli Indigenous Tribe',
      category: 'GI Tag Registered Visual Art',
      tag: 'GI Tag Registered (GI-442) • WebAR Flagship',
      icon: Brush,
      summary:
        'Ritual painting created with white rice paste and babool gum on ochre-coated mud walls using a chewed bamboo twig. Built from fundamental geometric shapes: circles for the sun and moon, triangles for mountains, and sacred Tarpa spirals.',
      experienceTitle: 'Interactive WebAR Experience',
      experienceLink: '/tradition/warli/ar',
      image: '/heritage-images/warli.jpg',
      audioText:
        'Warli Painting. Created by the indigenous Warli community in Maharashtra. Painted with white rice paste on ochre mud walls using chewed bamboo twigs. Explore 30 documented motifs through real-time WebAR camera target recognition.'
    }
  };

  const handleToggleAudio = (slug: string, text: string) => {
    if (playingSlug === slug) {
      stopCulturalNarration();
      setPlayingSlug(null);
      return;
    }

    stopCulturalNarration();
    setPlayingSlug(slug);

    speakCulturalNarration({
      text,
      voiceLang: 'en-IN',
      langCode: 'en',
      onStart: () => setPlayingSlug(slug),
      onEnd: () => setPlayingSlug(null),
      onError: () => setPlayingSlug(null)
    });
  };

  const currentZone = zoneDetails[activeZone];
  const CurrentZoneIcon = currentZone.icon;

  return (
    <div className="space-y-20 pb-24 pattern-mandala">
      {/* 1. HERO SECTION: Royal Indian Heritage Welcome */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 lg:pb-24 border-b border-[#E6D5C3] bg-gradient-to-b from-[#FAF8F5] via-[#F6EFE9] to-[#FAF8F5]">
        {/* Decorative lighting orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-amber-400/15 via-orange-500/15 to-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs backdrop-blur-sm">
              <span className="text-sm">🪷</span>
              <span className="font-cinzel">National Digital Heritage Preservation Initiative</span>
            </div>

            {/* Main Title */}
            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Connecting India's Living Heritage
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-700 font-sans max-w-3xl mx-auto leading-relaxed">
              Bridge physical museum exhibits and craft clusters with research-grounded digital storytelling. Explore North, South, East, and West India through authentic UNESCO and GI-registered traditions, multilingual oral histories, and WebAR.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                to="/explore"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-[#C2410C] hover:from-[#65230D] hover:to-[#9A3412] text-white shadow-xl shadow-orange-950/25 hover:shadow-orange-950/40 hover:-translate-y-0.5 transition-all"
              >
                <Compass className="w-5 h-5 text-amber-300" />
                <span>Explore Living Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/tradition/warli/ar"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Launch WebAR Camera</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  Live
                </span>
              </Link>

              <Link
                to="/posters"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-bold text-slate-800 bg-white/90 hover:bg-orange-50/80 border border-[#E6D5C3] shadow-sm hover:border-[#9A3412] transition-all"
              >
                <QrCode className="w-5 h-5 text-[#9A3412]" />
                <span>Exhibition Posters</span>
              </Link>
            </div>

            {/* Zero-Fabrication Guarantees Ribbon */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50/90 px-3.5 py-1.5 rounded-full border border-emerald-300/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Primary Archival Citations
              </span>
              <span className="flex items-center gap-1.5 text-blue-900 bg-blue-50/90 px-3.5 py-1.5 rounded-full border border-blue-300/80 shadow-xs">
                <Award className="w-4 h-4 text-blue-600" />
                UNESCO & GI Tag Grounded
              </span>
              <span className="flex items-center gap-1.5 text-amber-950 bg-amber-50/90 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Zero Fabricated Content Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 4-ZONE REGIONAL COMPASS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9A3412] font-cinzel">
            <Compass className="w-4 h-4" /> Strategic Heritage Mapping
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-900">
            Four Cardinal Cultural Zones of India
          </h2>
          <p className="text-sm text-slate-600">
            Select a geographic zone to explore its living craft tradition, listen to native oral storytelling, and enter its interactive digital experience.
          </p>
        </div>

        {/* Zone Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-1.5 max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-[#E6D5C3] shadow-xs">
          {(['north', 'south', 'east', 'west'] as const).map((z) => {
            const zData = zoneDetails[z];
            const isSelected = activeZone === z;
            return (
              <button
                key={z}
                onClick={() => {
                  setActiveZone(z);
                  if (playingSlug) {
                    stopCulturalNarration();
                    setPlayingSlug(null);
                  }
                }}
                className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-[#C2410C] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/70'
                }`}
              >
                <span>{z} India</span>
              </button>
            );
          })}
        </div>

        {/* Zone Detail Spotlight Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#E6D5C3] shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Photograph with Cultural Badges */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 group">
              <img
                src={currentZone.image}
                alt={currentZone.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-black/75 text-amber-300 backdrop-blur-md border border-white/20">
                  {currentZone.region}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md">
                  {currentZone.tag}
                </span>
              </div>

              {/* Audio Overlay Play Button on Image */}
              <button
                onClick={() => handleToggleAudio(currentZone.slug, currentZone.audioText)}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md text-xs font-bold border border-white/20 shadow-md transition-all cursor-pointer"
                title="Play Audio Overview"
              >
                {playingSlug === currentZone.slug ? (
                  <>
                    <VolumeX className="w-4 h-4 text-amber-400" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Hear Story</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Cultural Story & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9A3412] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentZone.state}</span>
                  <span>•</span>
                  <span>{currentZone.community}</span>
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900">
                  {currentZone.name}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                {currentZone.summary}
              </p>

              {/* Highlight Pill */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs font-semibold text-amber-950">
                <CurrentZoneIcon className="w-5 h-5 text-[#9A3412] flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">Experience Modality: </span>
                  <span>{currentZone.experienceTitle}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={currentZone.experienceLink}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch {currentZone.experienceTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/tradition/${currentZone.slug}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#9A3412]" />
                  <span>Curated Dossier</span>
                </Link>

                <Link
                  to={`/tradition/${currentZone.slug}/quiz`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Heritage Quiz</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR LIVING TRADITIONS SHOWCASE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6D5C3] pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] font-cinzel">
              Authentic Curatorial Catalog
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-900">
              Living Cultural Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each tradition is mapped to primary archives with zero synthetic data.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#9A3412] hover:text-[#7C2D12] transition-colors"
          >
            <span>View Full Heritage Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Retrieving verified cultural documentation...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((t) => {
              const isWarli = t.slug === 'warli';
              const experienceLabel =
                t.slug === 'thathera'
                  ? '8-Stage Craft Journey'
                  : t.slug === 'toda'
                  ? 'Motif Explorer'
                  : t.slug === 'chhau'
                  ? 'Performance Explorer'
                  : 'Flagship WebAR Vision';

              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-3xl border transition-all duration-500 flex flex-col overflow-hidden group hover:-translate-y-1.5 hover:shadow-2xl ${
                    isWarli
                      ? 'border-amber-400 ring-2 ring-amber-300/60 shadow-lg'
                      : 'border-[#E6D5C3] shadow-sm hover:border-[#9A3412]'
                  }`}
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/75 text-white backdrop-blur-sm">
                        {t.region} India
                      </span>
                    </div>

                    {isWarli && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                          <Camera className="w-3 h-3" /> WebAR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#9A3412] truncate">
                          {t.state}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-orange-50 text-[#9A3412] border border-orange-200 uppercase tracking-wide">
                          {experienceLabel}
                        </span>
                      </div>

                      <h3 className="font-cinzel text-xl font-bold text-slate-900 group-hover:text-[#9A3412] transition-colors leading-snug">
                        {t.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {t.short_description}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        to={`/tradition/${t.slug}`}
                        className="text-xs font-bold text-slate-700 hover:text-[#9A3412] flex items-center gap-1 transition-colors"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={isWarli ? '/tradition/warli/ar' : `/tradition/${t.slug}/experience`}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                          isWarli
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#9A3412] hover:bg-[#7C2D12] text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Experience</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. PHYSICAL TO DIGITAL EXHIBITION PATHWAY */}
      <section className="bg-gradient-to-b from-[#FAF6F0] via-[#F4EDE4] to-[#FAF6F0] border-y border-[#E6D5C3] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A3412] font-cinzel">
              End-to-End Heritage Workflow
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-900">
              The Parampara Experience Journey
            </h2>
            <p className="text-sm text-slate-600">
              How physical museum artifacts, exhibitions, and artisan clusters bridge to digital preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="glass-card p-6 rounded-3xl border border-[#E6D5C3] shadow-md text-center space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#9A3412] font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                1
              </div>
              <h4 className="font-cinzel font-bold text-base text-slate-900">Physical Exhibit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visit museum, exhibition gallery, or regional artisan guild cluster.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-[#E6D5C3] shadow-md text-center space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#9A3412] font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                2
              </div>
              <h4 className="font-cinzel font-bold text-base text-slate-900">Single Clean QR</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan official poster QR code directly into mobile browser with zero app download.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-amber-300 shadow-md text-center space-y-3 hover:-translate-y-1 transition-transform bg-amber-50/50">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-950 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                3
              </div>
              <h4 className="font-cinzel font-bold text-base text-slate-900">WebAR & Audio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aim device camera at artwork to unlock interactive hotspot symbols & oral history.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-[#E6D5C3] shadow-md text-center space-y-3 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#9A3412] font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                4
              </div>
              <h4 className="font-cinzel font-bold text-base text-slate-900">Active Learning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete verified 3-5 question archival quiz with instant scholarly feedback.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-emerald-300 shadow-md text-center space-y-3 hover:-translate-y-1 transition-transform bg-emerald-50/40">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
                5
              </div>
              <h4 className="font-cinzel font-bold text-base text-slate-900">Preservation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit local regional knowledge for institutional curatorial verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAMIFIED HERITAGE QUIZ TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[#E6D5C3] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-950 border border-emerald-300">
              <Award className="w-4 h-4 text-emerald-700" />
              Active Scholarly Learning
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              Test Your Cultural Heritage Knowledge
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Every tradition features an interactive quiz grounded directly in UNESCO Intangible Cultural Heritage dossiers, Geographical Indication registries, and INTACH monographs. Learn the verified truth behind each tradition.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                to="/tradition/thathera/quiz"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-[#9A3412] hover:text-[#9A3412] transition-colors"
              >
                Thathera Quiz
              </Link>
              <Link
                to="/tradition/toda/quiz"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-[#9A3412] hover:text-[#9A3412] transition-colors"
              >
                Toda Quiz
              </Link>
              <Link
                to="/tradition/chhau/quiz"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-[#9A3412] hover:text-[#9A3412] transition-colors"
              >
                Chhau Quiz
              </Link>
              <Link
                to="/tradition/warli/quiz"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-[#9A3412] hover:text-[#9A3412] transition-colors"
              >
                Warli Quiz
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/5 border border-amber-300/80 text-center space-y-3 max-w-sm w-full">
            <Award className="w-12 h-12 text-[#9A3412] mx-auto" />
            <h4 className="font-cinzel font-black text-lg text-slate-900">
              Verified Heritage Certification
            </h4>
            <p className="text-xs text-slate-600">
              Score 100% on any quiz to view official primary source citations and verification credentials.
            </p>
            <Link
              to="/tradition/warli/quiz"
              className="inline-block w-full py-3 rounded-xl text-xs font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-md transition-colors"
            >
              Start Warli Heritage Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* 6. POSTERS & AR PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#311042] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-500/30 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3.5 max-w-xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 font-cinzel">
              Museum & Exhibition Displays
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold leading-snug">
              Print Official Exhibition Posters with Single Clean QR Codes
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Designed for cultural institutions, schools, and museum galleries. Each high-resolution poster features authentic artwork, curatorial invitation copy, and a single clean QR code routing straight into its dedicated mobile experience.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Standard A4 Print-Ready • Zero Application Installation Required</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <Link
              to="/posters"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-xl shadow-amber-950/40 text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>View & Print Posters</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
