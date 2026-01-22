'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import CameraModal from './CameraModal';

export default function QuickCaptureBar() {
  const { isVoiceActive, setIsVoiceActive } = useApp();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      // Start voice recognition
      startVoiceRecognition();
    } else {
      // Stop voice recognition
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // TODO: Implement Web Speech API
    console.log('Voice recognition started');
  };

  const stopVoiceRecognition = () => {
    // TODO: Stop Web Speech API
    console.log('Voice recognition stopped');
  };

  const handlePhotoCapture = () => {
    setCameraMode('photo');
    setShowCameraModal(true);
  };

  const handleVideoCapture = () => {
    setCameraMode('video');
    setShowCameraModal(true);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          onClick={handlePhotoCapture}
          className="w-14 h-14 rounded-full glass-effect flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          aria-label="Take photo"
          title="Capture moment"
        >
          <i className="fas fa-camera text-primary text-xl"></i>
        </button>

        <button
          onClick={handleVideoCapture}
          className="w-14 h-14 rounded-full glass-effect flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          aria-label="Record video with AR"
          title="Reality check video"
        >
          <i className="fas fa-video text-secondary text-xl"></i>
        </button>

        <button
          onClick={handleVoiceToggle}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${
            isVoiceActive
              ? 'bg-gradient-to-br from-danger to-warning animate-pulse-slow'
              : 'glass-effect hover:bg-white/10'
          }`}
          aria-label="Voice input"
          title="Speak to companion"
        >
          {isVoiceActive && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-75">
              <span className="block w-full h-full rounded-full bg-danger/30"></span>
            </span>
          )}
          <i className={`fas fa-microphone text-xl ${isVoiceActive ? 'text-white' : 'text-accent'}`}></i>
        </button>
      </div>

      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        mode={cameraMode}
      />
    </>
  );
}

