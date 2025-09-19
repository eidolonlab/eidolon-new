import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Clock, Target, Users, Brain, Calendar } from 'lucide-react';

const ProfileInsights: React.FC = () => {
  const [profileStats, setProfileStats] = useState<{
    totalProfiles: number;
    mostActiveProfile: string;
    bestPerformingProfile: string;
    recentActivity: Array<{
      profileName: string;
      type: string;
      performance: number;
      date: Date;
    }>;
  }>({
    totalProfiles: 0,
    mostActiveProfile: '',
    bestPerformingProfile: '',
    recentActivity: []
  });

  useEffect(() => {
    analyzeAllProfiles();
  }, []);

  const analyzeAllProfiles = () => {
    const focusProfiles = JSON.parse(localStorage.getItem('eidolon-focus-profiles') || '[]');
    const memoryProfiles = JSON.parse(localStorage.getItem('eidolon-memory-profiles') || '[]');
    const scenarioProfiles = JSON.parse(localStorage.getItem('eidolon-scenario-profiles') || '[]');
    const coherenceProfiles = JSON.parse(localStorage.getItem('eidolon-coherence-profiles') || '[]');
    const executiveProfiles = JSON.parse(localStorage.getItem('eidolon-executive-profiles') || '[]');

    const allProfiles = [
      ...focusProfiles.map((p: any) => ({ ...p, type: 'Focus', performance: p.avgFocusScore })),
      ...memoryProfiles.map((p: any) => ({ ...p, type: 'Memory', performance: p.avgCoherence })),
      ...scenarioProfiles.map((p: any) => ({ ...p, type: 'Scenario', performance: p.completionRate })),
      ...coherenceProfiles.map((p: any) => ({ ...p, type: 'Coherence', performance: p.avgCoherence })),
      ...executiveProfiles.map((p: any) => ({ ...p, type: 'Executive', performance: p.avgEfficiency }))
    ];

    const totalProfiles = allProfiles.length;
    
    // Find most active profile (most sessions)
    const mostActive = allProfiles.reduce((max, profile) => 
      (profile.sessions || 0) > (max.sessions || 0) ? profile : max, 
      { name: 'None', sessions: 0 }
    );

    // Find best performing profile
    const bestPerforming = allProfiles.reduce((max, profile) => 
      (profile.performance || 0) > (max.performance || 0) ? profile : max,
      { name: 'None', performance: 0 }
    );

    // Recent activity
    const recentActivity = allProfiles
      .filter(p => p.lastUsed)
      .map(p => ({
        profileName: p.name,
        type: p.type,
        performance: p.performance || 0,
        date: new Date(p.lastUsed)
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    setProfileStats({
      totalProfiles,
      mostActiveProfile: mostActive.name,
      bestPerformingProfile: bestPerforming.name,
      recentActivity
    });
  };

  if (profileStats.totalProfiles === 0) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Users className="w-5 h-5 text-gray-400" />
        <div className="text-left">
          <div className="font-medium text-gray-500">Training Profiles</div>
          <div className="text-sm text-gray-400">Create profiles to track trends</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer">
      <BarChart3 className="w-5 h-5 text-emerald-600" />
      <div className="text-left flex-1">
        <div className="font-medium text-gray-900">Profile Analytics</div>
        <div className="text-sm text-gray-600">{profileStats.totalProfiles} active training profiles</div>
        {profileStats.mostActiveProfile !== 'None' && (
          <div className="text-xs text-emerald-700 mt-1">
            Most active: "{profileStats.mostActiveProfile}"
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInsights;