import React, { useState, useEffect } from 'react';
import { User, TrendingUp, Calendar, Award, Plus, X, BarChart3, Clock, Target } from 'lucide-react';

interface TrainingProfile {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastUsed: Date;
  totalSessions: number;
  averagePerformance: number;
  improvementTrend: number;
  tags: string[];
  color: string;
}

interface TrainingProfileManagerProps {
  onProfileSelect: (profile: TrainingProfile | null) => void;
  selectedProfile: TrainingProfile | null;
}

const TrainingProfileManager: React.FC<TrainingProfileManagerProps> = ({
  onProfileSelect,
  selectedProfile
}) => {
  const [profiles, setProfiles] = useState<TrainingProfile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    color: 'blue'
  });

  const colors = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'emerald', class: 'bg-emerald-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'indigo', class: 'bg-indigo-500' }
  ];

  const commonTags = [
    'Morning Training', 'Evening Practice', 'Post-Workout', 'Pre-Work',
    'Focused State', 'Relaxed State', 'High Energy', 'Calm Focus',
    'Skill Building', 'Performance Test', 'Baseline', 'Progress Check'
  ];

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const saved = localStorage.getItem('eidolon-training-profiles');
    if (saved) {
      const parsed = JSON.parse(saved).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        lastUsed: new Date(p.lastUsed)
      }));
      setProfiles(parsed);
    }
  };

  const saveProfiles = (newProfiles: TrainingProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('eidolon-training-profiles', JSON.stringify(newProfiles));
  };

  const createProfile = () => {
    if (!newProfile.name.trim()) return;

    const profile: TrainingProfile = {
      id: Date.now().toString(),
      name: newProfile.name.trim(),
      description: newProfile.description.trim(),
      createdAt: new Date(),
      lastUsed: new Date(),
      totalSessions: 0,
      averagePerformance: 0,
      improvementTrend: 0,
      tags: newProfile.tags,
      color: newProfile.color
    };

    saveProfiles([...profiles, profile]);
    setNewProfile({ name: '', description: '', tags: [], color: 'blue' });
    setShowCreateForm(false);
    onProfileSelect(profile);
  };

  const deleteProfile = (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this training profile? This will not affect your overall progress.')) {
      const newProfiles = profiles.filter(p => p.id !== profileId);
      saveProfiles(newProfiles);
      
      if (selectedProfile?.id === profileId) {
        onProfileSelect(null);
      }
    }
  };

  const addTag = (tag: string) => {
    if (!newProfile.tags.includes(tag)) {
      setNewProfile(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setNewProfile(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Training Profiles</h2>
            <p className="text-sm text-gray-600">Create named training sessions for separate progress tracking</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Profile</span>
        </button>
      </div>

      {/* Ethical Notice */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-900">Wellness & Fitness Focus</span>
        </div>
        <p className="text-sm text-green-800">
          Training profiles are for <strong>cognitive fitness and skill building</strong> - similar to having different workout routines. 
          This is not medical testing and makes no health claims. Track your personal improvement in different conditions or goals.
        </p>
      </div>

      {/* Default Training Option */}
      <div className="mb-6">
        <button
          onClick={() => onProfileSelect(null)}
          className={`w-full p-4 rounded-lg border transition-all ${
            !selectedProfile 
              ? 'border-gray-500 bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">General Training</h3>
              <p className="text-sm text-gray-600">Standard progress tracking (default)</p>
            </div>
          </div>
        </button>
      </div>

      {/* Existing Profiles */}
      {profiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Your Training Profiles</h3>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`p-4 rounded-lg border transition-all ${
                selectedProfile?.id === profile.id
                  ? `border-${profile.color}-500 bg-${profile.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onProfileSelect(profile)}
                  className="flex items-center space-x-3 flex-1 text-left"
                >
                  <div className={`w-10 h-10 bg-${profile.color}-100 rounded-lg flex items-center justify-center`}>
                    <User className={`w-5 h-5 text-${profile.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{profile.name}</h4>
                    <p className="text-sm text-gray-600">{profile.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{profile.totalSessions} sessions</span>
                      <span>•</span>
                      <span>Best: Level {profile.bestLevel}</span>
                      <span>•</span>
                      <span>Last used: {profile.lastUsed.toLocaleDateString()}</span>
                    </div>
                    {profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.tags.map(tag => (
                          <span key={tag} className={`px-2 py-0.5 bg-${profile.color}-100 text-${profile.color}-700 text-xs rounded-full`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => deleteProfile(profile.id)}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Profile Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Training Profile</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name *
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Focus Training"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newProfile.description}
                  onChange={(e) => setNewProfile(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Training sessions done in the morning when I'm most alert"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewProfile(prev => ({ ...prev, color: color.name }))}
                      className={`w-8 h-8 rounded-lg ${color.class} ${
                        newProfile.color === color.name ? 'ring-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        newProfile.tags.includes(tag)
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {newProfile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newProfile.tags.map(tag => (
                      <span key={tag} className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={createProfile}
                  disabled={!newProfile.name.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Profile
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Ethical Reminder */}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800">
                <strong>Wellness Focus:</strong> Training profiles are for personal cognitive fitness tracking, 
                similar to workout routines. This is not medical assessment or diagnosis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProfileManager;