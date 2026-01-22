'use client';

import { useState, useRef, useEffect } from 'react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'photo' | 'video';
}

export default function CameraModal({ isOpen, onClose, mode }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showAROverlay, setShowAROverlay] = useState(mode === 'video');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: mode === 'video',
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame
        ctx.drawImage(video, 0, 0);
        
        // Draw AR overlay if enabled
        if (showAROverlay) {
          // Timestamp
          const now = new Date();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(10, 10, 280, 50);
          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.fillText(`Reality Check: ${now.toLocaleString()}`, 20, 35);
          ctx.fillText(`✓ Validated`, 20, 52);
          
          // Grid overlay
          ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
          ctx.lineWidth = 1;
          for (let i = 0; i < canvas.width; i += canvas.width / 6) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
          }
          for (let i = 0; i < canvas.height; i += canvas.height / 6) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
          }
        }
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const saveMedia = () => {
    if (capturedImage) {
      // TODO: Save to storage or send to server
      const link = document.createElement('a');
      link.download = `psaicoach-capture-${Date.now()}.png`;
      link.href = capturedImage;
      link.click();
      
      alert('✓ Saved successfully!');
      handleClose();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setIsRecording(false);
  };

  const handleClose = () => {
    retake();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 backdrop-blur-xl bg-black/50 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <i className={`fas fa-${mode === 'photo' ? 'camera' : 'video'}`}></i>
          {mode === 'photo' ? 'Capture Moment' : 'Reality Check Video'}
        </h3>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <i className="fas fa-times text-white"></i>
        </button>
      </div>

      {/* Camera Preview or Captured Image */}
      <div className="flex-1 relative flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* AR Overlay Preview */}
            {showAROverlay && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Grid */}
                <svg className="w-full h-full opacity-30">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#667eea" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Timestamp Badge */}
                <div className="absolute top-16 left-4 bg-black/70 backdrop-blur-lg rounded-xl px-4 py-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-clock text-success"></i>
                    <span className="text-sm font-semibold">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-xs">Reality Check Active</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-xl bg-black/50 p-6">
        {capturedImage ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retake}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-2"
            >
              <i className="fas fa-redo"></i>
              Retake
            </button>
            <button
              onClick={saveMedia}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium flex items-center gap-2"
            >
              <i className="fas fa-save"></i>
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
            
            <button
              onClick={capturePhoto}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${
                isRecording ? 'bg-danger animate-pulse' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {mode === 'video' && isRecording ? (
                <div className="w-8 h-8 bg-white rounded-sm"></div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white"></div>
              )}
            </button>
            
            <button
              onClick={() => setShowAROverlay(!showAROverlay)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                showAROverlay ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <i className="fas fa-layer-group"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

