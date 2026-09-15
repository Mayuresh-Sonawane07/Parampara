import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Printer, Sparkles, ExternalLink, Download, Copy, Check, Globe, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';

export const PostersPage: React.FC = () => {
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  
  // Default to active browser domain, falling back to production URL
  const defaultOrigin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://parampara-api-oocd.onrender.com';

  const [baseUrl, setBaseUrl] = useState<string>(defaultOrigin);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const posters = [
    {
      slug: 'thathera',
      title: 'THATHERA METAL CRAFT',
      region: 'NORTH INDIA • PUNJAB',
      invitation: 'Journey through the 8 traditional stages of hand-hammered brass and copper utensil making in Jandiala Guru.',
      qrUrl: '/qr-assets/thathera.png',
      route: '/scan/thathera',
      image: '/heritage-images/thathera.jpg',
      experienceLabel: '8-Stage Craft Journey',
      sourceNote: 'UNESCO Representative List File 00845 & Sangeet Natak Akademi'
    },
    {
      slug: 'toda',
      title: 'TODA EMBROIDERY (PUKHOOR)',
      region: 'SOUTH INDIA • TAMIL NADU',
      invitation: 'Explore the sacred counted-thread geometry and floral shola motifs of the Nilgiri pastoral community.',
      qrUrl: '/qr-assets/toda.png',
      route: '/scan/toda',
      image: '/heritage-images/toda.jpg',
      experienceLabel: 'Counted-Thread Motif Explorer',
      sourceNote: 'Geographical Indications Registry No. 135 & Ministry of Textiles'
    },
    {
      slug: 'chhau',
      title: 'CHHAU DANCE TRADITION',
      region: 'EAST INDIA • JHARKHAND, WEST BENGAL, ODISHA',
      invitation: 'Discover the martial footwork, dramatic masks, and three regional styles of Seraikella, Purulia, and Mayurbhanj.',
      qrUrl: '/qr-assets/chhau.png',
      route: '/scan/chhau',
      image: '/heritage-images/chhau.jpg',
      experienceLabel: '3-Style Performance Explorer',
      sourceNote: 'UNESCO Representative List File 00337 & Sangeet Natak Akademi'
    },
    {
      slug: 'warli',
      title: 'WARLI PAINTING',
      region: 'WEST INDIA • MAHARASHTRA',
      invitation: 'Discover the sacred symbols, Tarpa dance spiral, and living stories behind this traditional Adivasi artwork.',
      qrUrl: '/qr-assets/warli.png',
      route: '/scan/warli',
      image: '/heritage-images/warli.jpg',
      experienceLabel: 'Flagship WebAR Experience',
      sourceNote: 'INTACH Dahanu Chapter Cultural Mapping & GI Registry No. 342'
    }
  ];

  const currentPoster = posters[activePosterIndex];
  const cleanBase = (baseUrl || 'https://parampara-api-oocd.onrender.com').replace(/\/+$/, '');
  const activeFullTargetUrl = `${cleanBase}/scan/${currentPoster.slug}`;

  // Dynamically generate high-contrast QR code whenever poster or base URL changes
  useEffect(() => {
    let isMounted = true;
    const currentSlug = currentPoster.slug;

    QRCode.toDataURL(activeFullTargetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#1E1E24', // Obsidian ink
        light: '#FAF7F2' // Archival parchment white
      },
      errorCorrectionLevel: 'H' // High resilience for physical phone scanning
    }).then((dataUrl) => {
      if (isMounted) {
        setQrDataUrls(prev => ({ ...prev, [currentSlug]: dataUrl }));
      }
    }).catch((err) => {
      console.error('Dynamic QR generation error:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [activeFullTargetUrl, currentPoster.slug]);

  const activeQrImage = qrDataUrls[currentPoster.slug] || currentPoster.qrUrl;

  const downloadQr = () => {
    const a = document.createElement('a');
    a.href = activeQrImage;
    a.download = `parampara-${currentPoster.slug}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyScanUrl = () => {
    navigator.clipboard.writeText(activeFullTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Overview */}
      <div className="border-b border-[#E6D5C3] pb-6 space-y-2 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A3412]">
          <QrCode className="w-4 h-4" />
          Physical-to-Digital Heritage Bridge
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Printable Physical Heritage Posters
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Each poster connects exhibition visitors to the living tradition experience through a verified, dynamic QR code. Print or display these posters in cultural centres, museum galleries, and hackathons.
        </p>
      </div>

      {/* Target Domain Bar / Exhibition Controls */}
      <div className="bg-[#FFFBF5] border border-[#E6D5C3] rounded-2xl p-4 sm:p-5 print:hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Dynamic QR
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Scanning phone opens:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs font-mono font-bold text-[#9A3412] bg-orange-100/60 px-2.5 py-1 rounded-md border border-orange-200">
              {activeFullTargetUrl}
            </code>
            <button
              onClick={copyScanUrl}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#9A3412] transition-colors"
              title="Copy Target URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* URL Customizer Dropdown/Input */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {isEditingUrl ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://parampara-api-oocd.onrender.com"
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A3412] w-64 font-mono"
              />
              <button
                onClick={() => setIsEditingUrl(false)}
                className="px-3 py-1.5 bg-[#9A3412] text-white text-xs font-bold rounded-lg hover:bg-[#7C2D12]"
              >
                Apply
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingUrl(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              Change Target Domain
            </button>
          )}

          {baseUrl !== defaultOrigin && (
            <button
              onClick={() => {
                setBaseUrl(defaultOrigin);
                setIsEditingUrl(false);
              }}
              title="Reset to default deployment domain"
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Poster Tabs Selector & Print Actions */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
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

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={downloadQr}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors shadow-xs"
            title="Download QR code image for this poster"
          >
            <Download className="w-4 h-4 text-[#9A3412]" /> Download QR PNG
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Current Poster
          </button>
        </div>
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/heritage-images/${currentPoster.slug}.jpg`;
            }}
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
              <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate max-w-xs">
                {activeFullTargetUrl}
              </div>
            </div>
          </div>

          {/* Clean High-Contrast Single Dynamic QR */}
          <div className="flex-shrink-0 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md flex flex-col items-center">
            <img
              src={activeQrImage}
              alt={`Dynamic QR Code for ${currentPoster.title}`}
              className="w-36 h-36 object-contain"
            />
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">
              Verified Heritage QR
            </span>
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
