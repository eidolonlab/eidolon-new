import React, { useState, useEffect } from 'react';
import { Activity, Heart, Brain, TrendingUp, Zap, Clock, Target, Award } from 'lucide-react';

interface BiometricData {
  heartRate: number;
  heartRateVariability: number;
  stressLevel: number;
  focusIndex: number;
  coherenceScore: number;
  timestamp: Date;
}

interface BiometricIntegrationProps {
  onBiometricUpdate: (data: BiometricData) => void;
  onOptimalStateDetected: () => void;
}

const BiometricIntegration: React.FC<BiometricIntegrationProps> = ({ 
  onBiometricUpdate, 
  onOptimalStateDetected 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<BiometricData>({
    heartRate: 72,
    heartRateVariability: 45,
    stressLevel: 3,
    focusIndex: 7,
    coherenceScore: 65,
    timestamp: new Date()
  });
  const [optimalZone, setOptimalZone] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<BiometricData[]>([]);
  const [realTimeCoaching, setRealTimeCoaching] = useState<string | null>(null);

  // Simulate biometric data (in real app, this would connect to actual devices)
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        simulateBiometricData();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const simulateBiometricData = () => {
    // Simulate realistic biometric fluctuations
    const baseHR = 70 + Math.sin(Date.now() / 10000) * 10;
    const hrVariation = Math.random() * 10 - 5;
    const heartRate = Math.round(baseHR + hrVariation);
    
    const heartRateVariability = Math.round(40 + Math.random() * 30);
    const stressLevel = Math.round(Math.max(1, Math.min(10, 5 + (Math.random() - 0.5) * 4)));
    const focusIndex = Math.round(Math.max(1, Math.min(10, 6 + (Math.random() - 0.5) * 6)));
    
    // Calculate coherence based on HRV and stress
    const coherenceScore = Math.round(
      Math.max(0, Math.min(100, 
        (heartRateVariability * 1.2) + (10 - stressLevel) * 5 + (focusIndex * 3)
      ))
    );

    const newData: BiometricData = {
      heartRate,
      heartRateVariability,
      stressLevel,
      focusIndex,
      coherenceScore,
      timestamp: new Date()
    };

    setCurrentData(newData);
    setSessionHistory(prev => [...prev.slice(-29), newData]); // Keep last 30 readings
    onBiometricUpdate(newData);

    // Check for optimal state
    const isOptimal = coherenceScore > 70 && stressLevel < 4 && focusIndex > 7;
    if (isOptimal && !optimalZone) {
      setOptimalZone(true);
      onOptimalStateDetected();
      setRealTimeCoaching("🎯 Optimal state detected! This is perfect for memory training.");
    } else if (!isOptimal && optimalZone) {
      setOptimalZone(false);
    }

    // Generate real-time coaching
    generateRealTimeCoaching(newData);
  };

  const generateRealTimeCoaching = (data: BiometricData) => {
    if (data.stressLevel > 7) {
      setRealTimeCoaching("😰 High stress detected. Try 4-7-8 breathing to activate your parasympathetic nervous system.");
    } else if (data.focusIndex < 4) {
      setRealTimeCoaching("🧘 Focus is low. Consider a 2-minute mindfulness exercise or brief physical movement.");
    } else if (data.coherenceScore > 80) {
      setRealTimeCoaching("✨ Excellent coherence! Your heart, mind, and breath are in perfect sync.");
    } else if (data.heartRateVariability < 25) {
      setRealTimeCoaching("💓 Low HRV detected. Deep, rhythmic breathing can help improve variability.");
    } else {
      setRealTimeCoaching(null);
    }
  };

  const connectDevice = () => {
    // Simulate device connection
    setIsConnected(true);
    alert("🔗 Biometric device connected! Real-time monitoring active.");
  };

  const getStateColor = () => {
    if (optimalZone) return 'emerald';
    if (currentData.stressLevel > 6) return 'red';
    if (currentData.focusIndex < 4) return 'yellow';
    return 'blue';
  };

  const stateColor = getStateColor();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Biometric Integration</h2>
            <p className="text-sm text-gray-600">Real-time physiological optimization</p>
          </div>
        </div>
        
        {!isConnected ? (
          <button
            onClick={connectDevice}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Connect Device
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-600 font-medium">Connected</span>
          </div>
        )}
      </div>

      {isConnected ? (
        <div className="space-y-6">
          {/* Real-time Coaching */}
          {realTimeCoaching && (
            <div className={`p-4 bg-${stateColor}-50 rounded-lg border border-${stateColor}-200`}>
              <div className="flex items-center space-x-2">
                <Brain className={`w-4 h-4 text-${stateColor}-600`} />
                <span className={`font-medium text-${stateColor}-900`}>AI Coach</span>
              </div>
              <p className={`text-sm text-${stateColor}-800 mt-1`}>{realTimeCoaching}</p>
            </div>
          )}

          {/* Current State Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{currentData.heartRate}</div>
              <div className="text-xs text-gray-600">BPM</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{currentData.heartRateVariability}</div>
              <div className="text-xs text-gray-600">HRV</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{currentData.stressLevel}/10</div>
              <div className="text-xs text-gray-600">Stress</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{currentData.focusIndex}/10</div>
              <div className="text-xs text-gray-600">Focus</div>
            </div>
          </div>

          {/* Coherence Meter */}
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-4">Coherence State</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={optimalZone ? '#10b981' : '#6366f1'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentData.coherenceScore / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${optimalZone ? 'text-emerald-600' : 'text-indigo-600'}`}>
                    {currentData.coherenceScore}
                  </div>
                  <div className="text-xs text-gray-500">Coherence</div>
                </div>
              </div>
            </div>
            
            <div className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
              optimalZone 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {optimalZone ? '🎯 Optimal Training State' : '🧘 Building Coherence'}
            </div>
          </div>

          {/* Session History Chart */}
          {sessionHistory.length > 5 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Session Trends</h3>
              <div className="h-24 flex items-end space-x-1">
                {sessionHistory.slice(-20).map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-indigo-500 rounded-t transition-all duration-300"
                    style={{ height: `${(data.coherenceScore / 100) * 96}px` }}
                    title={`Coherence: ${data.coherenceScore}`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Last 20 readings • Coherence trend
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Biometric Device</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect a heart rate monitor, fitness tracker, or use your phone's sensors for real-time 
            physiological feedback during memory training.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Heart Rate</div>
              <div className="text-sm text-gray-600">Optimal training zones</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">HRV</div>
              <div className="text-sm text-gray-600">Stress & recovery</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Coherence</div>
              <div className="text-sm text-gray-600">Mind-body sync</div>
            </div>
          </div>
          
          <button
            onClick={connectDevice}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Connect Biometric Device
          </button>
        </div>
      )}
    </div>
  );
};

export default BiometricIntegration;