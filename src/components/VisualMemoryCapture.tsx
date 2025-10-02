import React, { useState, useRef } from 'react';
import { Camera, Video, Upload, X, Eye, Download, Trash2, Image, Film, Sparkles } from 'lucide-react';

interface VisualMemoryCaptureProps {
  onImageCapture: (imageData: string, type: 'photo' | 'video') => void;
  onImageRemove: () => void;
  currentImage?: string;
  currentImageType?: 'photo' | 'video';
  className?: string;
}

const VisualMemoryCapture: React.FC<VisualMemoryCaptureProps> = ({
  onImageCapture,
  onImageRemove,
  currentImage,
  currentImageType,
  className = ''
}) => {
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const startCamera = async (mode: 'photo' | 'video') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: mode === 'video'
      });
      
      setStream(mediaStream);
      setCaptureMode(mode);
      setIsCapturing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Camera access failed. Please check permissions or use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Convert to base64 with compression
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onImageCapture(imageData, 'photo');
      stopCapture();
    }
  };

  const startVideoRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onImageCapture(reader.result as string, 'video');
        }
      };
      reader.readAsDataURL(blob);
      stopCapture();
    };

    mediaRecorder.start();
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
    setCaptureMode(null);
    setShowCaptureOptions(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB for performance)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Please choose a file under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const type = file.type.startsWith('video/') ? 'video' : 'photo';
        onImageCapture(reader.result as string, type);
      }
    };
    reader.readAsDataURL(file);
  };

  if (isCapturing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {captureMode === 'photo' ? 'Take Photo' : 'Record Video'}
            </h3>
            <button
              onClick={stopCapture}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {captureMode === 'photo' ? (
              <button
                onClick={capturePhoto}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={startVideoRecording}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span>Start Recording</span>
                </button>
                <button
                  onClick={stopVideoRecording}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span>Stop Recording</span>
                </button>
              </div>
            )}
            <button
              onClick={stopCapture}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image/Video Display */}
      {currentImage && (
        <div className="relative">
          {currentImageType === 'video' ? (
            <video
              src={currentImage}
              controls
              className="w-full max-h-64 rounded-lg border border-gray-200"
            />
          ) : (
            <img
              src={currentImage}
              alt="Memory visual"
              className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
            />
          )}
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Capture Options */}
      {!currentImage && (
        <div className="space-y-3">
          {!showCaptureOptions ? (
            <button
              onClick={() => setShowCaptureOptions(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <Camera className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Add Photo or Video</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => startCamera('photo')}
                className="flex flex-col items-center space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Camera className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Take Photo</span>
              </button>
              
              <button
                onClick={() => startCamera('video')}
                className="flex flex-col items-center space-y-2 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Video className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium text-red-700">Record Video</span>
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Upload className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Upload File</span>
              </button>
              
              <button
                onClick={() => setShowCaptureOptions(false)}
                className="flex flex-col items-center space-y-2 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Cancel</span>
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Visual Memory Benefits */}
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Visual Memory Science</span>
        </div>
        <p className="text-sm text-purple-800">
          Images and videos create 65% stronger memory encoding through dual-coding theory. 
          Visual memories activate both verbal and visual processing systems simultaneously.
        </p>
      </div>
    </div>
  );
};

export default VisualMemoryCapture;