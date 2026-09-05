import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, Sparkles, Compass } from 'lucide-react';

export const ScanRouterPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Recognizing Heritage QR Code...');

  const traditionTargets: { [key: string]: { name: string; targetRoute: string } } = {
    warli: {
      name: 'Warli Painting (Flagship WebAR)',
      targetRoute: '/tradition/warli/ar',
    },
    toda: {
      name: 'Toda Embroidery (Motif Explorer)',
      targetRoute: '/tradition/toda/experience',
    },
    thathera: {
      name: 'Thathera Metal Craft (Craft Journey)',
      targetRoute: '/tradition/thathera/experience',
    },
    chhau: {
      name: 'Chhau Dance (Performance Explorer)',
      targetRoute: '/tradition/chhau/experience',
    },
  };

  useEffect(() => {
    const validSlug = slug ? slug.toLowerCase() : '';
    const target = traditionTargets[validSlug];

    if (target) {
      setStatusMessage(`Found ${target.name}. Launching interactive digital experience...`);
      const timer = setTimeout(() => {
        navigate(target.targetRoute, { replace: true });
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      setStatusMessage(`Unrecognized QR code (${slug}). Redirecting to Heritage Explorer...`);
      const timer = setTimeout(() => {
        navigate('/explore', { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [slug, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6D5C3] rounded-3xl p-8 sm:p-12 shadow-xl max-w-md w-full text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="animate-ping absolute w-full h-full rounded-full bg-orange-200 opacity-60"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C2D12] to-[#9A3412] text-white flex items-center justify-center shadow-lg">
            <QrCode className="w-8 h-8 text-amber-300" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#9A3412] border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            Physical-to-Digital Transition
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            QR Code Detected
          </h2>
          <p className="text-sm text-slate-600 animate-pulse font-medium">
            {statusMessage}
          </p>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-[#9A3412] h-1.5 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};
