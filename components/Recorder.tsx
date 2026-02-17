
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogType } from '../types';

interface RecorderProps {
  type: LogType;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const Recorder: React.FC<RecorderProps> = ({ type, onComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // Use number instead of NodeJS.Timeout to avoid namespace errors in browser environments
  const timerRef = useRef<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera and microphone access to record.");
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      onComplete(blob);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    
    setCountdown(0);
    // Explicitly use window.setInterval to ensure the returned ID is a number compatible with the browser environment
    timerRef.current = window.setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Clean up the timer using window.clearInterval
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-between items-center z-10">
        <button onClick={onCancel} className="text-white text-lg font-medium px-4 py-2 apple-glass rounded-full">Cancel</button>
        <div className="px-4 py-2 apple-glass rounded-full text-white font-bold tracking-widest flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
          {formatTime(countdown)}
        </div>
        <div className="w-12" /> {/* spacer */}
      </div>

      <div className="absolute inset-0 w-full h-full overflow-hidden bg-zinc-900">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center gap-8 mb-12">
        <div className="text-center">
            <h2 className="text-2xl font-bold capitalize">{type} Session</h2>
            <p className="text-zinc-300 text-sm mt-1">
                {type === 'morning' ? "Plan your day. Focus on goals." : "Reflect on today. Set tomorrow's pace."}
            </p>
        </div>
        
        <button 
          onClick={toggleRecording}
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? 'border-zinc-500' : 'border-white'}`}
        >
          <div className={`transition-all duration-300 ${isRecording ? 'w-10 h-10 rounded-lg bg-red-500' : 'w-16 h-16 rounded-full bg-white'}`} />
        </button>
      </div>
    </div>
  );
};

export default Recorder;
