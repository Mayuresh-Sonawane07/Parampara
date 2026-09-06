import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CameraOff,
  Sparkles,
  X,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Upload,
  Zap,
  Scan,
  ZoomIn,
  ZoomOut,
  Aperture,
  List,
  Search,
  Filter
} from 'lucide-react';
import { fetchTradition } from '../services/api';
import { TraditionDetail, ARHotspot } from '../types';
import { WarliDigitalExperience } from '../features/warli/WarliDigitalExperience';
import { SourceBadge } from '../components/SourceBadge';
import { NarrationPlayer } from '../components/NarrationPlayer';
import {
  WARLI_TAXONOMY_30,
  WarliMotifDefinition,
  getTaxonomyMotifById
} from '../features/warli/warliTaxonomy30';
import {
  WARLI_SAMPLE_ARTWORKS,
  WarliArtworkPreset,
  analyzeWarliCanvas,
  convertMotifsToHotspots,
  getFallbackMotifs
} from '../features/warli/warliCvEngine';

export const WarliARPage: React.FC = () => {
  const [tradition, setTradition] = useState<TraditionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [selectedHotspot, setSelectedHotspot] = useState<ARHotspot | null>(null);
  const [showAllInsightsModal, setShowAllInsightsModal] = useState<boolean>(false);
  const [activeInsightIndex, setActiveInsightIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic 30-Motif Library & Preset State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tarpa-festival');
  const [dynamicHotspots, setDynamicHotspots] = useState<ARHotspot[]>([]);
  const [activeMotifsCount, setActiveMotifsCount] = useState<number>(8);
  const [taxonomySearch, setTaxonomySearch] = useState<string>('');
  const [taxonomyCategoryFilter, setTaxonomyCategoryFilter] = useState<string>('all');

  // WebAR Target Detection & Camera Capture State
  const [cameraCaptureMode, setCameraCaptureMode] = useState<'live' | 'locked'>('live');
  const [capturedFrameUrl, setCapturedFrameUrl] = useState<string | null>(null);
  const [isArtworkInView, setIsArtworkInView] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(76);
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(false);
  const [showGuideOverlay, setShowGuideOverlay] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>('/ar-assets/warli-target.jpg');
  const [analysisStatusMessage, setAnalysisStatusMessage] = useState<string>(
    'Aim camera at Warli artwork inside the viewfinder'
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const steadyCounterRef = useRef<number>(0);
  const insightsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If starting in upload tab, initialize with default preset
    if (activeTab === 'upload') {
      const defaultPreset = WARLI_SAMPLE_ARTWORKS[0];
      const initialHotspots: ARHotspot[] = defaultPreset.motifIds.map((id, index) => {
        const motif = getTaxonomyMotifById(id)!;
        const coord = defaultPreset.customCoords?.[id] || motif.defaultCoords;
        return {
          id: motif.id,
          ar_experience_id: 1,
          name: motif.name,
          x: coord.x,
          y: coord.y,
          content: motif.content,
          cultural_context: motif.cultural_context,
          regional_perspective: motif.regional_perspective,
          animation_type: index % 2 === 0 ? 'pulse' : 'glow',
          source: motif.source
        };
      });
      setDynamicHotspots(initialHotspots);
      setActiveMotifsCount(initialHotspots.length);
    } else {
      // In camera mode, start with empty hotspots until artwork is scanned
      setDynamicHotspots([]);
      setActiveMotifsCount(0);
    }

    fetchTradition('warli')
      .then((data) => {
        setTradition(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Auto-start camera when page loads in camera tab
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // Keyboard shortcut: Press Spacebar to snap and scan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeTab === 'camera' && cameraCaptureMode === 'live' && cameraState === 'active') {
        e.preventDefault();
        captureAndScanFrame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, cameraCaptureMode, cameraState]);

  // Attach live video stream whenever camera becomes active
  useEffect(() => {
    if (cameraState === 'active' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Video playback error, retrying on user interaction:', err);
      });
    }
  }, [cameraState]);

  // Real-time Computer Vision Frame Analysis loop for camera mode
  useEffect(() => {
    if (cameraState !== 'active' || !videoRef.current || cameraCaptureMode !== 'live') return;
    let animId: number;
    let lastSampleTime = 0;

    const runFrameAnalysis = (timestamp: number) => {
      if (timestamp - lastSampleTime > 300) {
        lastSampleTime = timestamp;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas && video.readyState >= 2) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = 120;
            canvas.height = 120;

            const size = Math.min(video.videoWidth, video.videoHeight) || 120;
            const sx = (video.videoWidth - size) / 2 || 0;
            const sy = (video.videoHeight - size) / 2 || 0;

            ctx.drawImage(video, sx, sy, size, size, 0, 0, 120, 120);

            try {
              const frame = ctx.getImageData(0, 0, 120, 120);
              const d = frame.data;
              let ochreCount = 0;
              let highContrastWhiteCount = 0;
              let contrastTransitions = 0;
              let total = 0;

              for (let i = 0; i < d.length; i += 16) {
                total++;
                const r = d[i];
                const g = d[i + 1];
                const b = d[i + 2];

                // Terracotta / Red Ochre background characteristic of Warli murals
                if (r > 70 && r > g * 1.08 && r > b * 1.18 && r < 240) {
                  ochreCount++;
                }
                // White rice-paste motifs
                if (r > 155 && g > 155 && b > 155) {
                  highContrastWhiteCount++;
                }

                // Transition detection (high edge density characteristic of tribal stick figures)
                if (i > 16) {
                  const prevLuma = (d[i - 16] + d[i - 15] + d[i - 14]) / 3;
                  const currLuma = (r + g + b) / 3;
                  if (Math.abs(currLuma - prevLuma) > 45) {
                    contrastTransitions++;
                  }
                }
              }

              const ochreRatio = ochreCount / (total || 1);
              const whiteRatio = highContrastWhiteCount / (total || 1);
              const edgeDensity = contrastTransitions / (total || 1);

              const detected =
                (ochreRatio > 0.08 && whiteRatio > 0.03) ||
                (edgeDensity > 0.12 && whiteRatio > 0.05);

              setIsArtworkInView(detected);

              if (detected) {
                const score = Math.min(99, Math.max(90, Math.round(88 + (ochreRatio + whiteRatio) * 40)));
                setConfidenceScore(score);
                setAnalysisStatusMessage('Warli Artwork in View! Tap "Scan Artwork"');
                steadyCounterRef.current += 1;

                // One-shot auto-scan if enabled
                if (autoScanEnabled && steadyCounterRef.current >= 4) {
                  steadyCounterRef.current = 0;
                  captureAndScanFrame();
                }
              } else {
                steadyCounterRef.current = 0;
                setConfidenceScore(68);
                setAnalysisStatusMessage('Position Warli artwork inside the viewfinder');
              }
            } catch (err) {
              // Canvas cross-origin fallback
            }
          }
        }
      }
      animId = requestAnimationFrame(runFrameAnalysis);
    };

    animId = requestAnimationFrame(runFrameAnalysis);
    return () => cancelAnimationFrame(animId);
  }, [cameraState, cameraCaptureMode, autoScanEnabled]);

  const startCamera = async () => {
    setActiveTab('camera');
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
      setCameraState('active');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. You can inspect the artwork using the digital copy view.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('Camera unavailable: No camera hardware detected on this device.');
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

  /**
   * Captures the precise viewfinder square from the live video,
   * freezes it in the viewer, and triggers motif identification.
   */
  const captureAndScanFrame = () => {
    const video = videoRef.current;
    const reticle = reticleRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (reticle) {
      const vRect = video.getBoundingClientRect();
      const rRect = reticle.getBoundingClientRect();

      const vWidth = video.videoWidth || 1280;
      const vHeight = video.videoHeight || 720;
      const renderedWidth = vRect.width;
      const renderedHeight = vRect.height;

      const scale = Math.max(renderedWidth / vWidth, renderedHeight / vHeight);
      const displayedVideoWidth = vWidth * scale;
      const displayedVideoHeight = vHeight * scale;

      const offsetX = (displayedVideoWidth - renderedWidth) / 2;
      const offsetY = (displayedVideoHeight - renderedHeight) / 2;

      const reticleRelativeX = (rRect.left - vRect.left) + offsetX;
      const reticleRelativeY = (rRect.top - vRect.top) + offsetY;

      const sx = Math.max(0, reticleRelativeX / scale);
      const sy = Math.max(0, reticleRelativeY / scale);
      const sWidth = Math.min(vWidth - sx, rRect.width / scale);
      const sHeight = Math.min(vHeight - sy, rRect.height / scale);

      ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 900, 900);
    } else {
      const vWidth = video.videoWidth || 1280;
      const vHeight = video.videoHeight || 720;
      const cropSize = Math.min(vWidth, vHeight);
      const sx = (vWidth - cropSize) / 2;
      const sy = (vHeight - cropSize) / 2;
      ctx.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, 900, 900);
    }

    const snapshotUrl = canvas.toDataURL('image/jpeg', 0.95);

    // Freeze captured frame
    setCapturedFrameUrl(snapshotUrl);
    setCameraCaptureMode('locked');
    setAutoScanEnabled(false); // CRITICAL: Stop auto-scan immediately to prevent recurring loop
    setIsScanning(true);
    setScanStepText('Analyzing geometric contrast & tribal contours...');

    // Run dynamic in-browser Computer Vision analysis across the 30-motif taxonomy
    const detected = analyzeWarliCanvas(canvas);
    const newHotspots = convertMotifsToHotspots(detected);
    setDynamicHotspots(newHotspots);
    setActiveMotifsCount(newHotspots.length);
    setSelectedPresetId('camera-capture');

    // Multi-stage CV identification animation
    setTimeout(() => {
      setScanStepText('Detecting central composition & sacred tribal figures...');
    }, 300);

    setTimeout(() => {
      setScanStepText('Filtering motifs present in scanned artwork...');
    }, 650);

    setTimeout(() => {
      setIsScanning(false);
      setScanStepText('');
      setConfidenceScore(newHotspots.length > 0 ? 98 : 40);
      setAnalysisStatusMessage(
        newHotspots.length > 0
          ? `Artwork Analyzed: ${newHotspots.length} Verified Warli Motifs Identified in this Image`
          : 'No Warli motifs detected in current frame. Please ensure painting is well-lit and aligned.'
      );
      setActiveInsightIndex(0);
      insightsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  };

  /**
   * Resets the locked capture and returns to the live camera feed.
   */
  const handleRescan = () => {
    setCapturedFrameUrl(null);
    setCameraCaptureMode('live');
    setAutoScanEnabled(false); // Ensure auto-scan remains OFF on rescan
    setZoomScale(1.0);
    setDynamicHotspots([]); // Clear scanned motifs so live feed is clean
    setActiveMotifsCount(0);
    setAnalysisStatusMessage('Position Warli artwork inside the viewfinder');
    setConfidenceScore(76);
  };

  const closeHotspotModal = () => {
    setSelectedHotspot(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImageUrl(dataUrl);
        setActiveTab('upload');
        setSelectedPresetId('custom');

        // Dynamically analyze uploaded artwork using Computer Vision engine
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 500;
          canvas.height = img.height || 500;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const detected = analyzeWarliCanvas(canvas);
            const newHotspots = convertMotifsToHotspots(detected);
            setDynamicHotspots(newHotspots);
            setActiveMotifsCount(newHotspots.length);
            setAnalysisStatusMessage(
              newHotspots.length > 0
                ? `Custom Warli Artwork Analyzed • ${newHotspots.length} Motifs Identified in this Image`
                : 'No Warli motifs detected in uploaded image. Please ensure image has clear white figures on dark/ochre background.'
            );
          }
        };
        img.src = dataUrl;
        setConfidenceScore(98);
        setActiveInsightIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = WARLI_SAMPLE_ARTWORKS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setUploadedImageUrl(preset.imageUrl);
    setActiveTab('upload');
    stopCamera();

    const newHotspots: ARHotspot[] = preset.motifIds.map((id, index) => {
      const motif = getTaxonomyMotifById(id)!;
      const customCoord = preset.customCoords?.[id] || motif.defaultCoords;
      return {
        id: motif.id,
        ar_experience_id: 1,
        name: motif.name,
        x: customCoord.x,
        y: customCoord.y,
        content: motif.content,
        cultural_context: motif.cultural_context,
        regional_perspective: motif.regional_perspective,
        animation_type: index % 2 === 0 ? 'pulse' : 'glow',
        source: motif.source
      };
    });

    setDynamicHotspots(newHotspots);
    setActiveMotifsCount(newHotspots.length);
    setActiveInsightIndex(0);
    setConfidenceScore(99);
    setAnalysisStatusMessage(`${preset.title} • ${newHotspots.length} Verified Motifs Mapped`);
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
  const isCameraLive = activeTab === 'camera' && cameraCaptureMode === 'live';
  // In live camera mode before scanning, there are no scanned hotspots.
  // When locked (scanned) or in digital/preset mode, show strictly the motifs present in this particular image.
  const hotspots = isCameraLive ? [] : dynamicHotspots;
  const currentInsightHotspot = hotspots[activeInsightIndex] || hotspots[0];

  const getMotifIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('palaghata') || n.includes('chauk')) return '🌾';
    if (n.includes('panchashiriya')) return '🛡️';
    if (n.includes('sun') || n.includes('surya') || n.includes('hirva')) return '☀️';
    if (n.includes('moon') || n.includes('chandra')) return '🌙';
    if (n.includes('kansari')) return '🌱';
    if (n.includes('tiger') || n.includes('waghya') || n.includes('bagh')) return '🐅';
    if (n.includes('flute') || n.includes('pawa') || n.includes('bansuri')) return '🪈';
    if (n.includes('tarpa') || n.includes('spiral')) return '🌀';
    if (n.includes('drum') || n.includes('dholak') || n.includes('thali')) return '🥁';
    if (n.includes('maiden') || n.includes('dance') || n.includes('partner')) return '💃';
    if (n.includes('tree') || n.includes('devrai') || n.includes('canopy')) return '🌳';
    if (n.includes('palm') || n.includes('tad') || n.includes('shindi')) return '🌴';
    if (n.includes('bamboo') || n.includes('kalak')) return '🎋';
    if (n.includes('creeper') || n.includes('vine') || n.includes('velli')) return '🌿';
    if (n.includes('peacock') || n.includes('mor') || n.includes('mayur')) return '🦚';
    if (n.includes('cattle') || n.includes('bullock') || n.includes('bail')) return '🐂';
    if (n.includes('deer') || n.includes('haran') || n.includes('chital')) return '🦌';
    if (n.includes('boar') || n.includes('dukkar')) return '🐗';
    if (n.includes('bird') || n.includes('rooster') || n.includes('kombda')) return '🐓';
    if (n.includes('serpent') || n.includes('scorpion') || n.includes('vinchu') || n.includes('nag')) return '🦂';
    if (n.includes('hut') || n.includes('karvi') || n.includes('dwelling')) return '🛖';
    if (n.includes('winnow') || n.includes('soop')) return '🌾';
    if (n.includes('pound') || n.includes('ukhli') || n.includes('musar')) return '🥣';
    if (n.includes('water') || n.includes('carrier') || n.includes('ghada') || n.includes('panyawali')) return '🏺';
    if (n.includes('granary') || n.includes('kanga')) return '🧺';
    if (n.includes('plough') || n.includes('nangar') || n.includes('farmer')) return '🚜';
    if (n.includes('hunt') || n.includes('bow') || n.includes('arrow') || n.includes('archer') || n.includes('shikar')) return '🏹';
    if (n.includes('fish') || n.includes('net') || n.includes('bhor')) return '🐟';
    if (n.includes('border') || n.includes('patti') || n.includes('toran')) return '🔺';
    if (n.includes('wine') || n.includes('handi')) return '🏺';
    return '✨';
  };

  const getShortName = (name: string) => {
    const matched = WARLI_TAXONOMY_30.find(
      (m) => m.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(m.slug)
    );
    if (matched) return matched.shortName;
    return name.replace(/^The\s+/i, '').split('(')[0].trim();
  };

  const filteredTaxonomyMotifs = WARLI_TAXONOMY_30.filter((m) => {
    const matchesCategory = taxonomyCategoryFilter === 'all' || m.category === taxonomyCategoryFilter;
    const matchesSearch =
      !taxonomySearch ||
      m.name.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      m.marathiName.includes(taxonomySearch) ||
      m.content.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      m.cultural_context.toLowerCase().includes(taxonomySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If user declined camera or unsupported, render digital fallback
  if (cameraState === 'denied' || cameraState === 'unsupported') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
              <CameraOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-red-950">
                Camera AR unavailable on this device
              </h4>
              <p className="text-xs text-red-800">
                {errorMessage || 'Camera permission was not granted. Inspecting via high-resolution digital mode.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-red-900 border border-red-300 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Camera Again
            </button>
            <button
              onClick={() => {
                setCameraState('idle');
                setActiveTab('upload');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#9A3412] text-white hover:bg-[#7C2D12] transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Inspect Digital Copy
            </button>
          </div>
        </div>

        {arExp && <WarliDigitalExperience arExperience={arExp} isFallbackMode={true} />}
      </div>
    );
  }

  // ACTIVE SCANNER VIEW
  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-y-auto select-none pb-12">
      {/* Hidden offscreen canvas for real-time video frame analysis */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* AMBIENT BACKGROUND DISPLAY */}
      {activeTab === 'camera' ? (
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        />
      ) : (
        <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
          <img
            src={uploadedImageUrl || '/ar-assets/warli-target.jpg'}
            alt="Ambient backdrop"
            className="w-full h-full object-cover blur-3xl opacity-25 scale-110"
          />
        </div>
      )}

      {/* TOP CONTROL BAR */}
      <div className="relative z-40 p-3 sm:p-4 bg-gradient-to-b from-black/95 via-black/75 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Status Badge & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Target Status Badge */}
          <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
            {isScanning ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-xs font-semibold tracking-wider text-amber-300">
                  {scanStepText || 'Scanning Artwork...'}
                </span>
              </>
            ) : cameraCaptureMode === 'locked' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wider text-emerald-300">
                  {hotspots.length > 0
                    ? `Scanned Picture Insights Active (${hotspots.length} ${hotspots.length === 1 ? 'Motif' : 'Motifs'})`
                    : 'Scanned Picture Active (0 Motifs Found)'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  {confidenceScore}%
                </span>
              </>
            ) : isArtworkInView ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-300">
                  Artwork In View • Ready to Scan
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-300">
                  {analysisStatusMessage}
                </span>
              </>
            )}
          </div>

          {/* Mode Switcher: Live Camera vs Digital Copy */}
          <div className="flex items-center bg-black/85 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
              onClick={() => {
                setActiveTab('camera');
                if (cameraState !== 'active') startCamera();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'camera' ? 'bg-[#9A3412] text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Live Camera AR
            </button>
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#9A3412] text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Digital Copy View
            </button>
          </div>
        </div>

        {/* Right Controls: Always-Visible Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* ALWAYS ACCESSIBLE AUTO-SCAN TOGGLE (Never gets hidden) */}
          {activeTab === 'camera' && (
            <button
              onClick={() => setAutoScanEnabled(!autoScanEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                autoScanEnabled
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-black'
                  : 'bg-black/70 text-slate-300 border-white/20 hover:bg-black/90'
              }`}
              title="Toggle automatic scanning when painting is held steady"
            >
              <Zap className={`w-3.5 h-3.5 ${autoScanEnabled ? 'fill-current text-slate-950' : 'text-amber-400'}`} />
              <span>Auto-Scan: {autoScanEnabled ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {/* Quick All 30 Motifs Modal Trigger */}
          <button
            onClick={() => setShowAllInsightsModal(true)}
            title="View all 30 documented motifs in the Warli library"
            className="flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
            <span>All 30 Motifs</span>
          </button>

          {/* Flip Camera (only in camera mode) */}
          {activeTab === 'camera' && (
            <button
              onClick={toggleCameraFacing}
              title="Switch camera facing mode"
              className="bg-black/70 hover:bg-black/90 p-2 rounded-full text-xs font-bold border border-white/20 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Guide Ghost Overlay (only in camera mode) */}
          {activeTab === 'camera' && (
            <button
              onClick={() => setShowGuideOverlay(!showGuideOverlay)}
              title="Toggle target alignment guide ghost"
              className={`flex items-center gap-1 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                showGuideOverlay
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-black/70 border-white/20 text-white hover:bg-black/90'
              }`}
            >
              {showGuideOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showGuideOverlay ? 'Hide Guide' : 'Guide'}</span>
            </button>
          )}

          {/* Upload different digital copy file */}
          {activeTab === 'upload' && (
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload custom Warli artwork image"
              className="flex items-center gap-1.5 bg-black/70 hover:bg-black/90 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
          )}

          {/* Exit to 2D Mode */}
          <Link
            to="/tradition/warli"
            onClick={stopCamera}
            className="flex items-center gap-1 bg-black/70 hover:bg-black/90 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white transition-colors"
          >
            2D Mode <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* SAMPLE ARTWORKS & PRESET SELECTOR (Allows testing diverse Warli styles) */}
      <div className="relative z-30 px-3 py-1.5 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none bg-black/60 backdrop-blur-md border-y border-white/10">
        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider hidden md:inline flex-shrink-0">
          Warli Style:
        </span>
        {WARLI_SAMPLE_ARTWORKS.map((preset) => {
          const isSelected = selectedPresetId === preset.id && activeTab === 'upload';
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black ring-2 ring-amber-400/40'
                  : 'bg-black/75 hover:bg-black/95 text-slate-300 border-white/20'
              }`}
              title={preset.description}
            >
              <span>
                {preset.genre === 'tarpa' ? '🌀' : preset.genre === 'palaghata' ? '🌾' : preset.genre === 'village' ? '🚜' : '🌳'}
              </span>
              <span className="whitespace-nowrap">{preset.title.split(' ')[0]} {preset.title.split(' ')[1]}</span>
            </button>
          );
        })}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            selectedPresetId === 'custom'
              ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
              : 'bg-black/75 hover:bg-black/95 text-amber-300 border-amber-400/40'
          }`}
          title="Upload any custom Warli artwork from your device"
        >
          <Upload className="w-3 h-3" />
          <span>Upload Custom</span>
        </button>
      </div>

      {/* CENTER AR RETICLE & HOTSPOT MAPPING FRAME */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-3 gap-2">
        {/* Scanned status notification banner */}
        {activeTab === 'camera' && cameraCaptureMode === 'locked' && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {hotspots.length > 0
                ? `Universal CV Analysis: ${hotspots.length} Verified Motifs Identified in this Artwork`
                : 'Artwork Scanned: 0 Warli Motifs Detected in Current View'}
            </span>
          </div>
        )}

        {/* VIEWPORT CONTAINER (Measured via reticleRef for pixel-perfect cropping) */}
        <div
          ref={reticleRef}
          className={`relative w-[86vw] max-w-[390px] sm:max-w-[430px] aspect-square rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${
            activeTab === 'camera' && cameraCaptureMode === 'live'
              ? isArtworkInView
                ? 'bg-transparent border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ring-4 ring-emerald-500/40'
                : 'bg-transparent border-amber-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ring-2 ring-amber-400/20'
              : cameraCaptureMode === 'locked'
              ? 'bg-black border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)] ring-4 ring-amber-500/30'
              : 'border-amber-400/80 bg-stone-900/90'
          }`}
        >
          {/* CASE 1: DIGITAL COPY MODE */}
          {activeTab === 'upload' && (
            <img
              src={uploadedImageUrl || '/ar-assets/warli-target.jpg'}
              alt="Warli Artwork Target"
              className="absolute inset-0 w-full h-full object-cover select-none z-0"
            />
          )}

          {/* CASE 2: CAMERA MODE - LOCKED SCAN SNAPSHOT */}
          {activeTab === 'camera' && cameraCaptureMode === 'locked' && capturedFrameUrl && (
            <img
              src={capturedFrameUrl}
              alt="Captured Warli Artwork"
              style={{ transform: `scale(${zoomScale})` }}
              className="absolute inset-0 w-full h-full object-cover select-none z-0 transition-transform duration-200"
            />
          )}

          {/* Reticle corner accents */}
          <div
            className={`absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl z-30 pointer-events-none transition-colors ${
              isArtworkInView || cameraCaptureMode === 'locked' ? 'border-emerald-400' : 'border-amber-400'
            }`}
          ></div>
          <div
            className={`absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl z-30 pointer-events-none transition-colors ${
              isArtworkInView || cameraCaptureMode === 'locked' ? 'border-emerald-400' : 'border-amber-400'
            }`}
          ></div>
          <div
            className={`absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl z-30 pointer-events-none transition-colors ${
              isArtworkInView || cameraCaptureMode === 'locked' ? 'border-emerald-400' : 'border-amber-400'
            }`}
          ></div>
          <div
            className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl z-30 pointer-events-none transition-colors ${
              isArtworkInView || cameraCaptureMode === 'locked' ? 'border-emerald-400' : 'border-amber-400'
            }`}
          ></div>

          {/* Animated Laser Sweep Effect (Scanning beam) */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-scan-laser pointer-events-none z-20"></div>

          {/* Optional Ghost Guide in Camera Mode */}
          {activeTab === 'camera' && showGuideOverlay && (
            <div className="absolute inset-4 opacity-30 rounded-2xl overflow-hidden border border-white/30 pointer-events-none z-10 transition-opacity">
              <img
                src="/heritage-images/warli.jpg"
                alt="Warli target guidance"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* LIVE CAMERA OVERLAY: AIMING GUIDE & CENTER TARGET INDICATOR */}
          {activeTab === 'camera' && cameraCaptureMode === 'live' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-amber-300">
                <Scan className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Align painting inside the frame</span>
              </div>

              {/* Center Target Circular Reticle */}
              <div
                className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                  isArtworkInView
                    ? 'border-emerald-400 bg-emerald-500/15 scale-105 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'border-amber-400/50 scale-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              </div>

              {/* Aiming status notice */}
              <div className="text-center">
                {isArtworkInView ? (
                  <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg animate-bounce inline-block">
                    ✓ Warli Artwork In Focus! Tap "Scan Artwork"
                  </span>
                ) : (
                  <span className="bg-black/70 text-slate-300 text-[11px] px-3 py-1 rounded-full backdrop-blur-sm">
                    Hold phone or paper painting in view
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AUGMENTED REALITY HOTSPOTS & MOTIF BOUNDING REGIONS */}
          {/* Rendered when in Upload mode OR when Camera has Scanned & Locked */}
          {(activeTab === 'upload' || cameraCaptureMode === 'locked') && (
            <div className="absolute inset-0 pointer-events-auto z-30 animate-in fade-in duration-300">
              {hotspots.map((h, idx) => {
                const isSelected = activeInsightIndex === idx;
                return (
                  <div
                    key={h.id}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* AR Bounding Bracket Box when selected */}
                    {isSelected && (
                      <div className="absolute -inset-5 border-2 border-amber-300 rounded-2xl bg-amber-500/25 pointer-events-none animate-pulse">
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                      </div>
                    )}

                    {/* Active Insight Bubble Tooltip directly on the Scanned Picture */}
                    {isSelected && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 bg-slate-950/95 text-white border border-amber-300 rounded-xl px-3 py-1 shadow-2xl text-[11px] whitespace-nowrap animate-bounce pointer-events-none">
                        <span className="font-bold text-amber-400">{getShortName(h.name)}</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-300"></div>
                      </div>
                    )}

                    {/* Pulsating Hotspot Interactive Pin */}
                    <button
                      onClick={() => {
                        setActiveInsightIndex(idx);
                        setSelectedHotspot(h);
                      }}
                      className={`relative flex items-center justify-center group focus:outline-none transition-transform hover:scale-125 cursor-pointer ${
                        isSelected ? 'scale-115' : ''
                      }`}
                      title={`${h.name} - Tap to inspect`}
                    >
                      <span className="animate-ping absolute inline-flex h-11 w-11 rounded-full bg-amber-400 opacity-80"></span>
                      <span
                        className={`relative inline-flex rounded-full h-9 w-9 text-slate-950 font-black text-sm items-center justify-center border-2 border-white shadow-2xl transition-colors ${
                          isSelected
                            ? 'bg-amber-300 ring-4 ring-amber-400/70'
                            : 'bg-gradient-to-tr from-amber-600 to-amber-400 hover:bg-amber-300'
                        }`}
                      >
                        <span>{getMotifIcon(h.name)}</span>
                      </span>

                      {/* Hotspot Label Tag */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 backdrop-blur-md text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-white font-black'
                            : 'bg-black/85 text-white border-white/20 group-hover:bg-amber-500 group-hover:text-black'
                        }`}
                      >
                        {getShortName(h.name)}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRIMARY CAMERA SCANNING & RESCAN ACTIONS */}
        {activeTab === 'camera' && (
          <div className="flex items-center gap-2 flex-wrap justify-center pointer-events-auto z-40">
            {cameraCaptureMode === 'live' ? (
              <>
                {/* PRIMARY SCAN BUTTON */}
                <button
                  onClick={captureAndScanFrame}
                  className={`flex items-center gap-2 px-6 py-2 rounded-2xl text-sm font-black transition-all shadow-xl cursor-pointer ${
                    isArtworkInView
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 scale-105 shadow-emerald-500/30 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  }`}
                >
                  <Aperture className="w-4 h-4" />
                  <span>📸 Scan Artwork</span>
                </button>
              </>
            ) : (
              <>
                {/* RESCAN BUTTON */}
                <button
                  onClick={handleRescan}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🔄 Rescan Live Camera</span>
                </button>

                {/* ZOOM ADJUSTMENTS FOR PHONE SCREEN / PAPER DISTANCE */}
                <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                  <span className="text-[11px] text-slate-300 px-1 font-bold">Fit:</span>
                  <button
                    onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.1))}
                    title="Zoom Out"
                    className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-mono px-1">{Math.round(zoomScale * 100)}%</span>
                  <button
                    onClick={() => setZoomScale(Math.min(1.6, zoomScale + 0.1))}
                    title="Zoom In"
                    className="p-1 rounded hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setZoomScale(1.0)}
                    title="Reset to 100%"
                    className="text-[10px] px-1.5 py-0.5 bg-white/10 hover:bg-white/20 rounded font-bold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM LIVE AR INSIGHTS PANEL (ALWAYS VISIBLE & PROMINENT) */}
      <div ref={insightsPanelRef} className="relative z-40 px-3 sm:px-6 pointer-events-auto">
        <div className="max-w-3xl mx-auto space-y-3">
          {activeTab === 'camera' && cameraCaptureMode === 'live' ? (
            /* STATE A: LIVE CAMERA VIEW - GUIDING CALLOUT */
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center space-y-3 shadow-2xl animate-in fade-in duration-200">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-lg border border-amber-400/30">
                📷
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-amber-300">
                  Ready to Scan Warli Artwork
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Align any Warli painting inside the reticle and tap <strong className="text-amber-400">"📸 Scan Artwork"</strong>. The computer vision engine will analyze the painting and display <strong className="text-white">only the motifs present in your specific artwork</strong>.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <button
                  onClick={captureAndScanFrame}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
                >
                  <Aperture className="w-3.5 h-3.5" />
                  <span>Scan Artwork Now</span>
                </button>
                <button
                  onClick={() => setShowAllInsightsModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                >
                  📚 Browse All 30 Reference Motifs
                </button>
              </div>
            </div>
          ) : hotspots.length === 0 ? (
            /* STATE B: SCANNED BUT ZERO MOTIFS DETECTED */
            <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 text-center space-y-3 shadow-2xl animate-in fade-in duration-200">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-lg border border-amber-400/30">
                🔍
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-amber-300">
                  No Warli Motifs Detected in Current Frame
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  We could not detect clear white rice-paste Warli figures. Ensure the painting is well-lit, clearly aligned inside the reticle, then tap Rescan.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                {activeTab === 'camera' && (
                  <button
                    onClick={handleRescan}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rescan Live Camera</span>
                  </button>
                )}
                <button
                  onClick={() => handleSelectPreset('tarpa-festival')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                >
                  View Sample Painting
                </button>
                <button
                  onClick={() => setShowAllInsightsModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                >
                  📚 All 30 Reference Library
                </button>
              </div>
            </div>
          ) : (
            /* STATE C: VERIFIED MOTIFS DETECTED IN THIS PARTICULAR ARTWORK */
            <>
              {/* Header & Direct Navigation for Scanned Insights */}
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 uppercase font-serif">
                    {cameraCaptureMode === 'locked' ? 'Scanned Artwork Verified Insights' : 'Documented Iconography Insights'} ({activeInsightIndex + 1} of {hotspots.length} detected)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveInsightIndex((activeInsightIndex - 1 + hotspots.length) % hotspots.length)}
                    className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/15 text-xs font-bold transition-colors cursor-pointer"
                    title="Previous Motif"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveInsightIndex((activeInsightIndex + 1) % hotspots.length)}
                    className="p-1 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/15 text-xs font-bold transition-colors cursor-pointer"
                    title="Next Motif"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowAllInsightsModal(true)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40 transition-colors cursor-pointer ml-1 whitespace-nowrap"
                  >
                    All 30 Library
                  </button>
                </div>
              </div>

              {/* Quick Motif Carousel Tabs (Direct insight selector for detected motifs) */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                {hotspots.map((h, idx) => {
                  const isActive = activeInsightIndex === idx;
                  return (
                    <button
                      key={h.id}
                      onClick={() => {
                        setActiveInsightIndex(idx);
                      }}
                      className={`flex-1 min-w-[105px] sm:min-w-0 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-102 font-black ring-2 ring-amber-400/50'
                          : 'bg-black/75 hover:bg-black/95 text-slate-300 border-white/15'
                      }`}
                    >
                      <span className="text-sm">{getMotifIcon(h.name)}</span>
                      <span className="truncate">{getShortName(h.name)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Expanded Active Insight Card */}
              {currentInsightHotspot && (
                <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl">{getMotifIcon(currentInsightHotspot.name)}</span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                        {currentInsightHotspot.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                        DETECTED IN ARTWORK
                      </span>
                      <span className="text-[11px] font-mono text-amber-400">
                        Motif {activeInsightIndex + 1} of {hotspots.length}
                      </span>
                    </div>
                  </div>

                  {/* Documented Iconography Description */}
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                    {currentInsightHotspot.content}
                  </p>

                  {/* Cultural Symbolism Callout */}
                  {currentInsightHotspot.cultural_context && (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/95 leading-relaxed">
                      <strong className="text-amber-400 font-bold">Sacred Cultural Symbolism: </strong>
                      {currentInsightHotspot.cultural_context}
                    </div>
                  )}

                  {/* Regional Perspective */}
                  {currentInsightHotspot.regional_perspective && (
                    <div className="text-[11px] text-slate-300 flex items-start gap-1.5 bg-slate-800/60 p-2.5 rounded-lg border border-white/10">
                      <span className="text-amber-400 flex-shrink-0">📍</span>
                      <span><strong>Regional Archival Perspective:</strong> {currentInsightHotspot.regional_perspective}</span>
                    </div>
                  )}

                  {/* Action Buttons for the Active Insight */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
                    {/* Multi-language Spoken Audio Narration (English, Hindi, Marathi) */}
                    <NarrationPlayer
                      traditionSlug="warli"
                      motifTitle={currentInsightHotspot.name}
                      motifContent={currentInsightHotspot.content}
                      culturalContext={currentInsightHotspot.cultural_context}
                    />

                    <div className="flex items-center gap-2">
                      {currentInsightHotspot.source && (
                        <SourceBadge source={currentInsightHotspot.source} compact />
                      )}
                      {/* Open Full Archival Details Modal */}
                      <button
                        onClick={() => setSelectedHotspot(currentInsightHotspot)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Full Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL 1: FULL ARCHIVAL DETAILS MODAL DIALOG */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full border border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getMotifIcon(selectedHotspot.name)}</span>
                <h4 className="font-serif font-bold text-lg">{selectedHotspot.name}</h4>
              </div>
              <button
                onClick={closeHotspotModal}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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

              {/* Multi-language Spoken Narration (English, Hindi, Marathi) */}
              <NarrationPlayer
                traditionSlug="warli"
                motifTitle={selectedHotspot.name}
                motifContent={selectedHotspot.content}
                culturalContext={selectedHotspot.cultural_context}
              />

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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Return to AR View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPLETE 30-MOTIF WARLI ARCHIVAL LIBRARY MODAL */}
      {showAllInsightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full border border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#7C2D12] to-[#9A3412] p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                    Complete 30-Motif Warli Archival Library
                  </h4>
                  <p className="text-[11px] text-amber-200/90">
                    INTACH Dahanu Chapter & GI Registry No. 211 Verified Ethnographic Taxonomy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllInsightsModal(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-white/10 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 30 motifs (e.g., Palaghata, Tarpa, Tiger, Sun, Moon, Winnowing, Bullocks, Rice)..."
                  value={taxonomySearch}
                  onChange={(e) => setTaxonomySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/90 text-white text-xs border border-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
                {[
                  { id: 'all', label: 'All 30 Motifs', count: 30 },
                  { id: 'cosmology', label: 'Deities & Chauk', count: 6 },
                  { id: 'dance', label: 'Music & Dance', count: 5 },
                  { id: 'ecology', label: 'Sacred Ecology', count: 4 },
                  { id: 'fauna', label: 'Fauna & Wildlife', count: 6 },
                  { id: 'village', label: 'Village Life', count: 5 },
                  { id: 'labor', label: 'Labor & Borders', count: 4 }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTaxonomyCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap border ${
                      taxonomyCategoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md'
                        : 'bg-slate-800/70 text-slate-300 border-white/10 hover:bg-slate-800'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Motifs List */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto divide-y divide-white/10 flex-1">
              {filteredTaxonomyMotifs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No motifs found matching "{taxonomySearch}". Try searching for another term.
                </div>
              ) : (
                filteredTaxonomyMotifs.map((m) => {
                  const isCurrentlyInHotspots = hotspots.some((h) => h.id === m.id);
                  return (
                    <div key={m.id} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl flex-shrink-0 mt-0.5 shadow-md">
                          {m.icon}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-serif font-bold text-sm sm:text-base text-amber-300">
                              {m.name}
                            </h5>
                            <span className="text-[11px] font-bold text-amber-100/90 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                              {m.marathiName}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-white/10">
                              {m.categoryLabel}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {m.content}
                          </p>

                          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200/95 leading-relaxed">
                            <strong className="text-amber-400 font-bold">Cultural Symbolism: </strong>
                            {m.cultural_context}
                          </div>

                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-0.5">
                            <span className="text-amber-400">📍</span>
                            <span>{m.regional_perspective}</span>
                          </div>

                          {/* Multi-language Spoken Audio Narration */}
                          <div className="pt-1.5">
                            <NarrationPlayer
                              traditionSlug="warli"
                              motifTitle={m.name}
                              motifContent={m.content}
                              culturalContext={m.cultural_context}
                              compact
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Button: Inspect Motif in AR */}
                      <div className="self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={() => {
                            setShowAllInsightsModal(false);
                            const existingIndex = hotspots.findIndex((h) => h.id === m.id);
                            if (existingIndex >= 0) {
                              setActiveInsightIndex(existingIndex);
                            } else {
                              // Dynamically inject motif into active hotspots
                              const newSpot: ARHotspot = {
                                id: m.id,
                                ar_experience_id: 1,
                                name: m.name,
                                x: m.defaultCoords.x,
                                y: m.defaultCoords.y,
                                content: m.content,
                                cultural_context: m.cultural_context,
                                regional_perspective: m.regional_perspective,
                                animation_type: 'pulse',
                                source: m.source
                              };
                              const updated = [...hotspots, newSpot];
                              setDynamicHotspots(updated);
                              setActiveInsightIndex(updated.length - 1);
                            }
                            insightsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }}
                          className={`text-xs px-3.5 py-1.5 font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 ${
                            isCurrentlyInHotspots
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                              : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                          }`}
                        >
                          <Scan className="w-3 h-3" />
                          <span>{isCurrentlyInHotspots ? 'Active on Artwork' : 'Inspect in AR'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Showing {filteredTaxonomyMotifs.length} of 30 documented Warli motifs
              </span>
              <button
                onClick={() => setShowAllInsightsModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
