import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Star, Target, Calendar, Award, Plus, X, Heart, Briefcase, GraduationCap, Users } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface ImpactEntry {
  id: string;
  weaveId: string;
  weaveTitle: string;
  impactType: 'presentation' | 'interview' | 'conversation' | 'exam' | 'social' | 'personal';
  description: string;
  confidenceBefore: number;
  confidenceAfter: number;
  successRating: number;
  date: Date;
  notes?: string;
}

const RealWorldImpactTracker: React.FC = () => {
  const { weaves } = useWeave();
  const [impacts, setImpacts] = useState<ImpactEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    weaveId: '',
    impactType: 'presentation' as ImpactEntry['impactType'],
    description: '',
    confidenceBefore: 3,
    confidenceAfter: 3,
    successRating: 3,
    notes: ''
  });

  useEffect(() => {
    // Load saved impacts
    const savedImpacts = localStorage.getItem('eidolon-impact-tracker');
    if (savedImpacts) {
      const parsed = JSON.parse(savedImpacts).map((impact: any) => ({
        ...impact,
        date: new Date(impact.date)
      }));
      setImpacts(parsed);
    }
  }, []);

  const saveImpacts = (newImpacts: ImpactEntry[]) => {
    setImpacts(newImpacts);
    localStorage.setItem('eidolon-impact-tracker', JSON.stringify(newImpacts));
  };

  const addImpact = () => {
    if (!formData.weaveId || !formData.description) return;

    const weave = weaves.find(w => w.id === formData.weaveId);
    if (!weave) return;

    const newImpact: ImpactEntry = {
      id: Date.now().toString(),
      weaveId: formData.weaveId,
      weaveTitle: weave.title,
      impactType: formData.impactType,
      description: formData.description,
      confidenceBefore: formData.confidenceBefore,
      confidenceAfter: formData.confidenceAfter,
      successRating: formData.successRating,
      date: new Date(),
      notes: formData.notes
    };

    saveImpacts([newImpact, ...impacts]);
    
    // Reset form
    setFormData({
      weaveId: '',
      impactType: 'presentation',
      description: '',
      confidenceBefore: 3,
      confidenceAfter: 3,
      successRating: 3,
      notes: ''
    });
    setShowAddForm(false);
  };

  const getImpactIcon = (type: ImpactEntry['impactType']) => {
    switch (type) {
      case 'presentation': return Target;
      case 'interview': return Briefcase;
      case 'exam': return GraduationCap;
      case 'conversation': return Users;
      case 'social': return Heart;
      case 'personal': return Star;
      default: return CheckCircle;
    }
  };

  const getImpactColor = (type: ImpactEntry['impactType']) => {
    switch (type) {
      case 'presentation': return 'blue';
      case 'interview': return 'emerald';
      case 'exam': return 'purple';
      case 'conversation': return 'orange';
      case 'social': return 'pink';
      case 'personal': return 'indigo';
      default: return 'gray';
    }
  };

  const calculateAverageImprovement = () => {
    if (impacts.length === 0) return 0;
    const improvements = impacts.map(i => i.confidenceAfter - i.confidenceBefore);
    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  };

  const getSuccessRate = () => {
    if (impacts.length === 0) return 0;
    const successfulImpacts = impacts.filter(i => i.successRating >= 4);
    return (successfulImpacts.length / impacts.length) * 100;
  };

  const trainedWeaves = weaves.filter(w => w.type === 'future' || w.retrievalCount > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Real-World Impact</h2>
            <p className="text-sm text-gray-600">Track how memory training helps in real situations</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Impact</span>
        </button>
      </div>

      {/* Summary Stats */}
      {impacts.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              +{calculateAverageImprovement().toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Confidence Boost</div>
            <div className="text-xs text-emerald-700 mt-1">Before → After training</div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {getSuccessRate().toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-blue-700 mt-1">Rated 4+ out of 5</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {impacts.length}
            </div>
            <div className="text-sm text-gray-600">Real-World Wins</div>
            <div className="text-xs text-purple-700 mt-1">Training applied successfully</div>
          </div>
        </div>
      )}

      {/* Recent Impacts */}
      {impacts.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Recent Success Stories</h3>
          {impacts.slice(0, 5).map((impact) => {
            const IconComponent = getImpactIcon(impact.impactType);
            const color = getImpactColor(impact.impactType);
            
            return (
              <div key={impact.id} className={`p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{impact.description}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: impact.successRating }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 text-${color}-500 fill-current`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Trained with: "{impact.weaveTitle}"
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Confidence: {impact.confidenceBefore} → {impact.confidenceAfter}</span>
                      <span>•</span>
                      <span>{impact.date.toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{impact.impactType}</span>
                    </div>
                    {impact.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{impact.notes}"</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Success</h3>
          <p className="text-gray-600 mb-4">
            Record how your memory training helps in real-world situations
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Your First Success Story
          </button>
        </div>
      )}

      {/* Add Impact Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Success Story</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which memory/scenario helped you?
                </label>
                <select
                  value={formData.weaveId}
                  onChange={(e) => setFormData(prev => ({ ...prev, weaveId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a memory or scenario</option>
                  {trainedWeaves.map((weave) => (
                    <option key={weave.id} value={weave.id}>
                      {weave.title} ({weave.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of situation
                </label>
                <select
                  value={formData.impactType}
                  onChange={(e) => setFormData(prev => ({ ...prev, impactType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="presentation">Presentation/Speaking</option>
                  <option value="interview">Job Interview</option>
                  <option value="conversation">Important Conversation</option>
                  <option value="exam">Exam/Test</option>
                  <option value="social">Social Event</option>
                  <option value="personal">Personal Goal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What happened?
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe how your memory training helped in this situation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Before
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFormData(prev => ({ ...prev, confidenceBefore: rating }))}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          rating <= formData.confidenceBefore 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence After
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFormData(prev => ({ ...prev, confidenceAfter: rating }))}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          rating <= formData.confidenceAfter 
                            ? 'bg-emerald-500 hover:bg-emerald-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Success Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFormData(prev => ({ ...prev, successRating: rating }))}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        rating <= formData.successRating 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4 text-white mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional thoughts or observations..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addImpact}
                  disabled={!formData.weaveId || !formData.description}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Success Story
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impact Categories */}
      {impacts.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-4">Impact by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(
              impacts.reduce((acc, impact) => {
                acc[impact.impactType] = (acc[impact.impactType] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => {
              const IconComponent = getImpactIcon(type as ImpactEntry['impactType']);
              const color = getImpactColor(type as ImpactEntry['impactType']);
              
              return (
                <div key={type} className={`p-3 bg-${color}-50 rounded-lg border border-${color}-200 text-center`}>
                  <IconComponent className={`w-6 h-6 text-${color}-600 mx-auto mb-2`} />
                  <div className="font-medium text-gray-900 capitalize">{type}</div>
                  <div className="text-sm text-gray-600">{count} success{count !== 1 ? 'es' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Context */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Clinical Evidence</span>
        </div>
        <p className="text-sm text-indigo-800">
          Tracking real-world application helps measure the ecological validity of memory training. 
          Research shows that confidence improvements and successful goal achievement are strong 
          predictors of long-term cognitive benefit and training adherence.
        </p>
      </div>
    </div>
  );
};

export default RealWorldImpactTracker;