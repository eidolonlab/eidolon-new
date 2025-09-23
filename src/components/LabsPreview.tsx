import React, { useState } from 'react';
import { 
  Brain, Users, Target, TrendingUp, Zap, Calendar, Award, 
  Eye, Heart, Sparkles, Lock, Clock, Star, ArrowRight,
  Beaker, Rocket, Shield, Globe, Lightbulb
} from 'lucide-react';

interface LabsPreviewProps {
  onClose: () => void;
}

const LabsPreview: React.FC<LabsPreviewProps> = ({ onClose }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const labsFeatures = [
    {
      id: 'story-graph',
      title: 'StoryGraph',
      subtitle: 'Your Knowledge Map',
      description: 'Visual network of people, places, projects & promises with smart memory linking',
      status: 'Phase 2 - Q2 2025',
      category: 'Core Innovation',
      icon: Users,
      color: 'purple',
      benefits: [
        'Context-aware memory resurfacing',
        'Relationship and project tracking',
        'Smart memory recommendations',
        'Visual knowledge navigation'
      ],
      competitorGap: 'No competitor offers autobiographical memory mapping',
      demoText: 'Imagine your memories automatically connecting to people, places, and projects. When you meet Sarah again, Eidolon surfaces your last conversation details.'
    },
    {
      id: 'transfer-lab',
      title: 'Transfer Lab',
      subtitle: 'N-of-1 Experiments',
      description: 'Personal science experiments to prove what memory techniques work for you',
      status: 'Phase 2 - Q2 2025',
      category: 'Differentiation',
      icon: Target,
      color: 'emerald',
      benefits: [
        'Personalized effectiveness data',
        'Scientific approach to self-improvement',
        'Objective progress measurement',
        'Custom protocol optimization'
      ],
      competitorGap: 'Only Eidolon offers personal memory science experiments',
      demoText: 'Test "Does pre-event name rehearsal help me remember people?" Run 7-day experiments with control vs. intervention conditions.'
    },
    {
      id: 'meaningful-wins',
      title: 'Meaningful Wins',
      subtitle: 'Progress Currency',
      description: 'Track real-world outcomes instead of abstract scores - kept promises, remembered names',
      status: 'Phase 1 - Available Now',
      category: 'Core Innovation',
      icon: Award,
      color: 'yellow',
      benefits: [
        'Real-world impact tracking',
        'Intrinsic motivation system',
        'Transfer evidence collection',
        'Personal growth documentation'
      ],
      competitorGap: 'Competitors focus on game scores, not life outcomes',
      demoText: 'Instead of "Level 5 achieved," track "Remembered all client names at networking event" with confidence before/after ratings.'
    },
    {
      id: 'coach-protocols',
      title: 'Coach Protocols',
      subtitle: 'Professional Workspace',
      description: 'Drag-and-drop protocol builder for coaches, therapists, and educators',
      status: 'Phase 3 - Q3 2025',
      category: 'B2B2C Innovation',
      icon: Brain,
      color: 'blue',
      benefits: [
        'Custom client journeys',
        'Progress monitoring dashboard',
        'Protocol marketplace',
        'Professional collaboration tools'
      ],
      competitorGap: 'No competitor offers coach-customizable memory protocols',
      demoText: 'Coaches build custom journeys: "New Manager Onboarding" = Memory Weaving + Focus Sprints + Scenario Planning, tailored to client needs.'
    },
    {
      id: 'anxiety-regulation',
      title: 'Anxiety Regulation Toolkit',
      subtitle: 'Acute + Preventive',
      description: 'Evidence-based anxiety management integrated with memory optimization',
      status: 'Phase 1 - Available Now',
      category: 'Wellness Integration',
      icon: Heart,
      color: 'red',
      benefits: [
        '60-120 second acute relief',
        'Preventive cognitive reframing',
        'Memory-anxiety integration',
        'Stress-optimized training'
      ],
      competitorGap: 'No memory app addresses anxiety as memory barrier',
      demoText: 'Detect high stress before memory training. Offer 2-minute regulation, then optimize memory formation in calmer state.'
    }
  ];

  const phaseRoadmap = [
    {
      phase: 'Phase 1 - Foundation',
      timeline: 'Current - Q1 2026',
      status: 'Live',
      features: ['Memory Weaving', 'Spaced Retrieval', 'ADHD Support', 'Meaningful Wins', 'Anxiety Toolkit'],
      color: 'emerald'
    },
    {
      phase: 'Phase 2 - Intelligence',
      timeline: 'Q2 2026',
      status: 'Development',
      features: ['StoryGraph', 'Transfer Lab', 'Context-Aware Resurfacing', 'Advanced Analytics'],
      color: 'blue'
    },
    {
      phase: 'Phase 3 - Professional',
      timeline: 'Q3 2026',
      status: 'Planning',
      features: ['Coach Protocols', 'Protocol Marketplace', 'Team Features', 'Clinical Integration'],
      color: 'purple'
    },
    {
      phase: 'Phase 4 - AI Enhancement',
      timeline: 'Q4 2026',
      status: 'Research',
      features: ['Predictive Memory Analytics', 'Personalized AI Coach', 'Natural Language Interface'],
      color: 'indigo'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Labs Introduction */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Beaker className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eidolon Labs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Peek behind the curtain at revolutionary memory features in development. 
          These innovations will set Eidolon apart from every competitor in the cognitive training space.
        </p>
      </div>

      {/* Competitive Advantage Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Rocket className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-indigo-900">Our Competitive Edge</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="font-medium text-indigo-900 mb-1">🧠 Narrative-Based Cognition</div>
            <div className="text-indigo-700">Autobiographical memory vs. abstract puzzles</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="font-medium text-indigo-900 mb-1">🎯 Real-Life Transfer</div>
            <div className="text-indigo-700">Meaningful wins vs. game scores</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="font-medium text-indigo-900 mb-1">👥 Professional Integration</div>
            <div className="text-indigo-700">Coach protocols vs. solo training</div>
          </div>
        </div>
      </div>

      {/* Phase Roadmap */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Development Roadmap</h3>
        <div className="space-y-3">
          {phaseRoadmap.map((phase, index) => (
            <div key={index} className={`p-4 bg-${phase.color}-50 rounded-lg border border-${phase.color}-200`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${phase.color}-100 rounded-lg flex items-center justify-center`}>
                    <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                    <p className="text-sm text-gray-600">{phase.timeline}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 bg-${phase.color}-200 text-${phase.color}-800 rounded-full text-xs font-medium capitalize`}>
                  {phase.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.features.map(feature => (
                  <span key={feature} className={`px-2 py-1 bg-white text-${phase.color}-700 text-xs rounded-full border border-${phase.color}-200`}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Previews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Revolutionary Features Preview</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {labsFeatures.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedFeature === feature.id
                    ? `border-${feature.color}-500 bg-${feature.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.subtitle}</p>
                    </div>
                  </div>
                  {feature.status.includes('Available Now') ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      Live
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{feature.status}</span>
                  <span className={`text-xs px-2 py-1 bg-${feature.color}-100 text-${feature.color}-700 rounded-full`}>
                    {feature.category}
                  </span>
                </div>

                {selectedFeature === feature.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="font-medium text-indigo-900 mb-1">🎯 Competitive Advantage</div>
                      <p className="text-sm text-indigo-800">{feature.competitorGap}</p>
                    </div>
                    
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="font-medium text-emerald-900 mb-1">💡 How It Works</div>
                      <p className="text-sm text-emerald-800">{feature.demoText}</p>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Key Benefits:</div>
                      <div className="space-y-1">
                        {feature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            <span className="text-sm text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {feature.status.includes('Available Now') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          // Navigate to the actual feature
                          if (feature.id === 'meaningful-wins') {
                            // Would trigger meaningful wins tracker
                          } else if (feature.id === 'anxiety-regulation') {
                            // Would trigger anxiety toolkit
                          }
                        }}
                        className={`w-full px-4 py-2 bg-${feature.color}-600 text-white rounded-lg hover:bg-${feature.color}-700 transition-colors`}
                      >
                        Try This Feature Now
                      </button>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Early Access Signup */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-yellow-900">Join Early Access</h3>
        </div>
        <p className="text-yellow-800 mb-4">
          Be among the first to test revolutionary memory features. Early access users help shape 
          the future of cognitive training and get lifetime benefits.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
            <Globe className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">First Access</div>
            <div className="text-xs text-gray-600">Try features before public release</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
            <Lightbulb className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Shape Development</div>
            <div className="text-xs text-gray-600">Your feedback guides feature design</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-yellow-200">
            <Shield className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Lifetime Benefits</div>
            <div className="text-xs text-gray-600">Special pricing and exclusive features</div>
          </div>
        </div>
        <button
          onClick={() => {
            alert('🎉 Early Access Interest Recorded!\n\nWe\'ll notify you when these features become available for testing. Thank you for your interest in shaping the future of memory training!');
          }}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
        >
          Request Early Access
        </button>
      </div>

      {/* Why This Matters */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Eidolon Will Lead the Market</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🧠 Unique Approach</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• <strong>Autobiographical focus:</strong> Real memories, not abstract puzzles</p>
              <p>• <strong>Transfer-first design:</strong> Every feature improves real life</p>
              <p>• <strong>Professional integration:</strong> Built for coaches and therapists</p>
              <p>• <strong>Evidence-based:</strong> Clinical techniques, not gamification</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📊 Market Differentiation</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• <strong>No direct competitors</strong> in autobiographical memory training</p>
              <p>• <strong>First to offer</strong> personal memory science experiments</p>
              <p>• <strong>Only app</strong> with coach protocol customization</p>
              <p>• <strong>Unique integration</strong> of memory + anxiety + ADHD support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          These features represent the future of memory training - moving beyond games to genuine cognitive enhancement.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue Using Current Features
        </button>
      </div>
    </div>
  );
};

export default LabsPreview;