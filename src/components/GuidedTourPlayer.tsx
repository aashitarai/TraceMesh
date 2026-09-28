/**
 * Guided Product Walkthrough & Audio-Narrated Interactive Tour Player
 * Provides automated guided movement across all views with real audio commentary,
 * visual soundwaves, captions, and step-by-step business narrative.
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { TOUR_STEPS, TourStep } from '../core/simulator/walkthroughStory';
import { audioNarrationService } from '../core/simulator/audioNarration';

interface GuidedTourPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const GuidedTourPlayer: React.FC<GuidedTourPlayerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioWaves, setAudioWaves] = useState<number[]>([40, 70, 30, 85, 60, 95, 45, 80]);

  const step: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  useEffect(() => {
    if (!isOpen) {
      audioNarrationService.stop();
      return;
    }

    // Switch view to match current step
    onNavigateTab(step.tab);

    if (isPlaying) {
      audioNarrationService.speak(step.narration, () => {
        // Auto-advance after narration ends
        if (currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      });
    }

    // Audio wave pulsing effect
    const interval = setInterval(() => {
      setAudioWaves([
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
        Math.floor(20 + Math.random() * 80),
      ]);
    }, 180);

    return () => {
      clearInterval(interval);
      audioNarrationService.stop();
    };
  }, [isOpen, currentStepIndex, isPlaying]);

  if (!isOpen) return null;

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioNarrationService.setMuted(newMuted);
    if (!newMuted && isPlaying) {
      audioNarrationService.speak(step.narration);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-slideUp">
      <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl shadow-2xl backdrop-blur-md p-5 text-xs text-slate-100 flex flex-col gap-3">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              {step.badge}
            </span>
            <span className="font-bold text-white text-sm">{step.title}</span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({currentStepIndex + 1} of {TOUR_STEPS.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Wave Visualizer */}
            <div className="flex items-end gap-0.5 h-4 px-2">
              {audioWaves.map((height, i) => (
                <div
                  key={i}
                  style={{ height: isPlaying && !isMuted ? `${height}%` : '20%' }}
                  className="w-1 bg-amber-400 rounded-full transition-all duration-150"
                />
              ))}
            </div>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isMuted ? 'Unmute Audio Commentary' : 'Mute Audio Commentary'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                audioNarrationService.stop();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Key Metric Callout */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px]">
          <div>
            <span className="text-amber-400 font-bold">{step.callout.heading}</span>
            <span className="text-slate-400 font-sans ml-2">{step.callout.subheading}</span>
          </div>
          {step.callout.keyMetric && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {step.callout.keyMetric}
            </span>
          )}
        </div>

        {/* Live Audio Narration Subtitles */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 text-slate-300 text-xs leading-relaxed font-sans italic">
          "{step.narration}"
        </div>

        {/* Player Controls & Step Indicators */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-7 bg-amber-400'
                    : idx < currentStepIndex
                    ? 'w-3 bg-emerald-400'
                    : 'w-3 bg-slate-800'
                }`}
                title={s.title}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 transition-all flex items-center gap-1"
            >
              <SkipBack className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isPlaying ? 'Pause Tour' : 'Resume'}
            </button>

            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-md shadow-sky-600/20"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
