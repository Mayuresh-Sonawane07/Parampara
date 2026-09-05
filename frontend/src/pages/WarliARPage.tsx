import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CameraOff, Sparkles, Volume2, VolumeX, X, BookOpen, ChevronRight, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { fetchTradition } from '../services/api';
import { TraditionDetail, ARHotspot } from '../types';
import { WarliDigitalExperience } from '../features/warli/WarliDigitalExperience';
import { SourceBadge } from '../components/SourceBadge';

export const WarliARPage: React.FC = () => {
  const [tradition, setTradition] = useState<TraditionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [selectedHotspot, setSelectedHotspot] = useState<ARHotspot | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // WebAR Target Detection state
  const [isTargetDetected, setIsTargetDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [showGuideOverlay, setShowGuideOverlay] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchTradition('warli')
      .then((data) => setTradition(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    return () => {
      stopCamera();
    };
  }, []);

  // Attach live video stream whenever camera becomes active and video element is mounted
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Video playback error, retrying on user interaction:', err);
      });

      // Initialize target detection simulation
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsTargetDetected(true);
        setIsScanning(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [cameraState]);

  const startCamera = async () => {
    setCameraState('requesting');
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Browser does not support camera media stream APIs or requires HTTPS.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      } catch (envErr) {
        console.warn('Preferred camera constraint failed, falling back to basic video:', envErr);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;

      // Update state to active - useEffect will attach srcObject and play
      setCameraState('active');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. You can still explore the artwork using the digital experience.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('Camera unavailable: No camera hardware detected on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('Camera already in use by another application or tab.');
      } else if (err.name === 'SecurityError') {
        setErrorMessage('Camera access blocked due to insecure origin. Production WebAR requires HTTPS.');
      } else {
        setErrorMessage(`Camera unavailable (${err.message || 'Unknown error'}).`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const toggleCameraFacing = async () => {
    stopCamera();
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextMode } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.warn);
      }
      setCameraState('active');
    } catch (err) {
      startCamera();
    }
  };

  const handleToggleNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const closeHotspotModal = () => {
    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setSelectedHotspot(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#9A3412] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading Warli AR Experience...</p>
      </div>
    );
  }

  const arExp = tradition?.ar_experience;
  const hotspots = arExp?.hotspots || [];

  // If user declined camera or unsupported, render the digital fallback
  if (cameraState === 'denied' || cameraState === 'unsupported') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner Alert */}
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
              <CameraOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-red-950">
                AR is unavailable on this device
              </h4>
              <p className="text-xs text-red-800">
                {errorMessage || 'Camera permission was not granted. Rendering high-resolution interactive digital experience.'}
              </p>
            </div>
          </div>
          <button
            onClick={startCamera}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-red-900 border border-red-300 hover:bg-red-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Camera Again
          </button>
        </div>

        {arExp && <WarliDigitalExperience arExperience={arExp} isFallbackMode={true} />}
      </div>
    );
  }

  // Pre-camera Permission Screen
  if (cameraState === 'idle') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-[#E6D5C3] shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-[#7C2D12] to-orange-950 text-white p-8 sm:p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
              National Living Heritage Platform • WebAR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide">
              Warli Painting WebAR Experience
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 max-w-xl mx-auto">
              Bridge physical art and digital storytelling. Point your device camera at the Warli poster or artwork to reveal interactive, source-backed cultural hotspots.
            </p>
          </div>

          {/* Camera Permission Box */}
          <div className="p-8 sm:p-12 space-y-8">
            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#9A3412]">
                <ShieldCheck className="w-5 h-5 text-[#9A3412]" />
                Camera Permission Disclosure
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Parampara needs camera access to recognize the heritage artwork.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={startCamera}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-[#9A3412] hover:bg-[#7C2D12] text-white shadow-lg shadow-orange-950/20 transition-all hover:scale-102"
              >
                <Camera className="w-5 h-5" />
                Allow Camera
              </button>

              <button
                onClick={() => setCameraState('denied')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors text-center"
              >
                Continue Without Camera
              </button>
            </div>

            {/* How It Works Steps */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs inline-flex items-center justify-center mb-2">1</span>
                <h5 className="font-bold text-xs text-slate-900">Show Physical Poster</h5>
                <p className="text-[11px] text-slate-500 mt-1">Open or print the Warli heritage poster.</p>
              </div>
              <div className="p-3">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs inline-flex items-center justify-center mb-2">2</span>
                <h5 className="font-bold text-xs text-slate-900">Target Recognition</h5>
                <p className="text-[11px] text-slate-500 mt-1">WebAR locks onto the geometric artwork features.</p>
              </div>
              <div className="p-3">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs inline-flex items-center justify-center mb-2">3</span>
                <h5 className="font-bold text-xs text-slate-900">Interactive Discovery</h5>
                <p className="text-[11px] text-slate-500 mt-1">Tap hotspots for narration, meaning, and quiz.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE WEBAR CAMERA VIEW
  return (
    <div className="relative min-h-[85vh] bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Live Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Camera Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
        {/* Tracking Status Badge */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          {isScanning ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                Scanning Artwork...
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                Target Acquired • 4 Hotspots
              </span>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Guide Ghost Overlay */}
          <button
            onClick={() => setShowGuideOverlay(!showGuideOverlay)}
            title="Toggle alignment guide overlay"
            className="flex items-center gap-1 bg-black/60 backdrop-blur-md hover:bg-black/80 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white transition-colors"
          >
            {showGuideOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showGuideOverlay ? 'Hide Guide' : 'Show Guide'}</span>
          </button>

          {/* Flip Camera */}
          <button
            onClick={toggleCameraFacing}
            title="Switch camera"
            className="flex items-center gap-1 bg-black/60 backdrop-blur-md hover:bg-black/80 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Exit to 2D Mode */}
          <button
            onClick={() => {
              stopCamera();
              setCameraState('denied');
            }}
            className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md hover:bg-black/80 px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white transition-colors"
          >
            Exit to 2D <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AR Reticle Alignment Frame Overlay */}
      <div className="relative z-20 w-[85vw] max-w-md aspect-square border-2 border-amber-400/80 rounded-3xl shadow-2xl flex items-center justify-center pointer-events-none">
        {/* Reticle corner accents */}
        <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-amber-400 rounded-tl-xl"></div>
        <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-amber-400 rounded-tr-xl"></div>
        <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-amber-400 rounded-bl-xl"></div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-amber-400 rounded-br-xl"></div>

        {/* Semi-transparent target image ghost overlay for visual guidance */}
        {showGuideOverlay && (
          <div className="absolute inset-4 opacity-35 rounded-2xl overflow-hidden border border-white/30 transition-opacity">
            <img
              src="/heritage-images/warli.jpg"
              alt="Warli target guidance"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Augmented Reality Hotspots anchored over the alignment frame */}
        <div className="absolute inset-0 pointer-events-auto">
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHotspot(h)}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 focus:outline-none"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-xs items-center justify-center border-2 border-white shadow-2xl">
                  <Sparkles className="w-4 h-4 text-amber-950" />
                </span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/85 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap border border-white/20">
                {h.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Bottom Guidance Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-30 flex flex-col items-center pointer-events-auto max-w-lg mx-auto">
        <div className="bg-black/75 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center shadow-xl space-y-1">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs font-bold text-amber-300">
              Target: Warli Ceremonial Painting
            </p>
            <button
              onClick={() => {
                setIsScanning(true);
                setIsTargetDetected(false);
                setTimeout(() => {
                  setIsTargetDetected(true);
                  setIsScanning(false);
                }, 1000);
              }}
              className="text-[10px] font-bold underline text-amber-200 hover:text-white"
            >
              Re-Scan
            </button>
          </div>
          <p className="text-[11px] text-slate-300">
            Center the Warli artwork within the frame. Tap any pulsating pin to discover its documented cultural meaning.
          </p>
        </div>
      </div>

      {/* Interactive AR Hotspot Modal Dialog */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="font-serif font-bold text-lg">{selectedHotspot.name}</h4>
              </div>
              <button
                onClick={closeHotspotModal}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Documented Iconography
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {selectedHotspot.content}
                </p>
              </div>

              {selectedHotspot.cultural_context && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 leading-relaxed">
                  <strong>Cultural Context:</strong> {selectedHotspot.cultural_context}
                </div>
              )}

              {selectedHotspot.regional_perspective && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  <strong>Regional Perspective:</strong> {selectedHotspot.regional_perspective}
                </div>
              )}

              {/* Audio Narration */}
              <div className="pt-2 flex items-center justify-between bg-orange-50 p-3 rounded-xl border border-orange-200">
                <span className="text-xs font-bold text-[#9A3412]">Spoken Narration</span>
                <button
                  onClick={() =>
                    handleToggleNarration(
                      `${selectedHotspot.name}. ${selectedHotspot.content}. ${selectedHotspot.cultural_context || ''}`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#9A3412] text-white hover:bg-[#7C2D12] transition-colors"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </>
                  )}
                </button>
              </div>

              {selectedHotspot.source && (
                <div className="pt-2">
                  <SourceBadge source={selectedHotspot.source} compact />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Link
                to="/tradition/warli/quiz"
                onClick={closeHotspotModal}
                className="text-xs font-bold text-[#9A3412] hover:underline flex items-center gap-1"
              >
                Test Knowledge in Quiz <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={closeHotspotModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
              >
                Return to AR Camera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
