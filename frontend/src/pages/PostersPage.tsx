import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Printer, Sparkles, ExternalLink, Download } from 'lucide-react';

export const PostersPage: React.FC = () => {
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const posters = [
    {
      slug: 'warli',
      title: 'WARLI PAINTING',
      region: 'WEST INDIA • MAHARASHTRA',
      invitation: 'Discover the sacred symbols, Tarpa dance spiral, and living stories behind this traditional Adivasi artwork.',
      qrUrl: '/qr-assets/warli.png',
      route: '/scan/warli',
      image: '/ar-assets/warli-target.jpg',
      experienceLabel: 'Flagship WebAR Experience',
      sourceNote: 'INTACH Dahanu Chapter Cultural Mapping & GI Registry No. 342'
    },
    {
      slug: 'toda',
      title: 'TODA EMBROIDERY (PUKHOOR)',
      region: 'SOUTH INDIA • TAMIL NADU',
      invitation: 'Explore the sacred counted-thread geometry and floral shola motifs of the Nilgiri pastoral community.',
      qrUrl: '/qr-assets/toda.png',
      route: '/scan/toda',
      image: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1200&q=80',
      experienceLabel: 'Counted-Thread Motif Explorer',
      sourceNote: 'Geographical Indications Registry No. 135 & Ministry of Textiles'
    },
    {
      slug: 'thathera',
      title: 'THATHERA METAL CRAFT',
      region: 'NORTH INDIA • PUNJAB',
      invitation: 'Journey through the 8 traditional stages of hand-hammered brass and copper utensil making in Jandiala Guru.',
      qrUrl: '/qr-assets/thathera.png',
      route: '/scan/thathera',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
      experienceLabel: '8-Stage Craft Journey',
      sourceNote: 'UNESCO Representative List File 00845 & Sangeet Natak Akademi'
    },
    {
      slug: 'chhau',
      title: 'CHHAU DANCE TRADITION',
      region: 'EAST INDIA • JHARKHAND, WEST BENGAL, ODISHA',
      invitation: 'Discover the martial footwork, dramatic masks, and three regional styles of Seraikella, Purulia, and Mayurbhanj.',
      qrUrl: '/qr-assets/chhau.png',
      route: '/scan/chhau',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      experienceLabel: '3-Style Performance Explorer',
      sourceNote: 'UNESCO Representative List File 00337 & Sangeet Natak Akademi'
    }
  ];

  const currentPoster = posters[activePosterIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412]">
          <QrCode className="w-4 h-4" />
          Physical-to-Digital Heritage Bridge
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Printable Physical Heritage Posters
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Each poster connects physical exhibition visitors to the Parampara digital experience through a single, clean QR code. Print and display these posters at hackathons, exhibitions, and cultural centres.
        </p>
      </div>

      {/* Poster Tabs Selector */}
      <div className="flex flex-wrap gap-2 print:hidden">
        {posters.map((p, idx) => (
          <button
            key={p.slug}
            onClick={() => setActivePosterIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePosterIndex === idx
                ? 'bg-[#9A3412] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
            }`}
          >
            {p.title.split(' ')[0]} ({p.region.split(' ')[0]})
          </button>
        ))}

        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Current Poster
        </button>
      </div>

      {/* THE PRINTABLE POSTER CARD (A4 Aspect Ratio Ready) */}
      <div className="max-w-2xl mx-auto bg-white border-4 border-[#7C2D12] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 print:border-2 print:p-6 print:shadow-none print:max-w-none">
        {/* Top Header */}
        <div className="text-center space-y-2 border-b-2 border-[#E6D5C3] pb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-[#9A3412]">
            <Sparkles className="w-4 h-4 text-amber-600" />
            PARAMPARA AR LITE • {currentPoster.region}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-wider text-slate-900 uppercase">
            {currentPoster.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            "{currentPoster.invitation}"
          </p>
        </div>

        {/* Poster Visual Image */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#E6D5C3] shadow-inner bg-slate-100">
          <img
            src={currentPoster.image}
            alt={currentPoster.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom QR Code & Scanning CTA */}
        <div className="bg-[#FAF8F5] border-2 border-[#E6D5C3] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9A3412] bg-orange-100/80 px-2.5 py-1 rounded-md">
              {currentPoster.experienceLabel}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              SCAN TO EXPLORE
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Open your smartphone camera or QR scanner to launch the interactive digital experience.
            </p>
            <div className="pt-1">
              <Link
                to={currentPoster.route}
                className="text-xs font-bold text-[#9A3412] hover:underline flex items-center gap-1"
              >
                Direct Digital Route: {currentPoster.route} <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Clean High-Contrast Single QR */}
          <div className="flex-shrink-0 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md">
            <img
              src={currentPoster.qrUrl}
              alt={`QR Code for ${currentPoster.title}`}
              className="w-36 h-36 object-contain"
            />
          </div>
        </div>

        {/* Verified Ground Truth Footer */}
        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
          Source Ground Truth: {currentPoster.sourceNote}
        </div>
      </div>
    </div>
  );
};
