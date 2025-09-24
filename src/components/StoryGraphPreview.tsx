import React, { useState, useEffect } from 'react';
import { Users, MapPin, Briefcase, Target, Plus, Search, Filter, Calendar, Heart, Brain, Zap, Eye, Link, Star, Lock, Sparkles, TrendingUp, Award } from 'lucide-react';

interface StoryNode {
  id: string;
  type: 'person' | 'place' | 'project' | 'promise';
  name: string;
  description: string;
  tags: string[];
  connections: string[];
  lastInteraction: Date;
  importance: number;
  memoryCount: number;
  nextAction?: string;
  photo?: string;
  context: {
    relationship?: string;
    location?: string;
    status?: string;
    deadline?: Date;
  };
}

interface StoryGraphPreviewProps {
  onEarlyAccess: () => void;
}

const StoryGraphPreview: React.FC<StoryGraphPreviewProps> = ({ onEarlyAccess }) => {
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  // Sample nodes to demonstrate the concept
  const sampleNodes: StoryNode[] = [
    {
      id: 'person-1',
      type: 'person',
      name: 'Sarah Johnson',
      description: 'Project manager at TechCorp, loves hiking',
      tags: ['work', 'colleague', 'mentor'],
      connections: ['project-1', 'place-1'],
      lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      importance: 4,
      memoryCount: 3,
      nextAction: 'Follow up on quarterly review feedback',
      context: { relationship: 'Manager' }
    },
    {
      id: 'place-1',
      type: 'place',
      name: 'Downtown Coffee Shop',
      description: 'Quiet corner spot, great for morning meetings',
      tags: ['work', 'meetings', 'focus'],
      connections: ['person-1'],
      lastInteraction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      importance: 3,
      memoryCount: 2,
      context: { location: '123 Main St' }
    },
    {
      id: 'project-1',
      type: 'project',
      name: 'Q1 Product Launch',
      description: 'New feature rollout with marketing campaign',
      tags: ['work', 'deadline', 'high-priority'],
      connections: ['person-1'],
      lastInteraction: new Date(),
      importance: 5,
      memoryCount: 1,
      nextAction: 'Prepare presentation for stakeholder review',
      context: { status: 'In Progress', deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    },
    {
      id: 'promise-1',
      type: 'promise',
      name: 'Call Mom Weekly',
      description: 'Committed to calling mom every Sunday',
      tags: ['family', 'commitment', 'weekly'],
      connections: [],
      lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      importance: 5,
      memoryCount: 0,
      nextAction: 'Call this Sunday at 2pm',
      context: { status: 'Active' }
    }
  ];

  const getNodeIcon = (type: StoryNode['type']) => {
    switch (type) {
      case 'person': return Users;
      case 'place': return MapPin;
      case 'project': return Briefcase;
      case 'promise': return Target;
      default: return Brain;
    }
  };

  const getNodeColor = (type: StoryNode['type']) => {
    switch (type) {
      case 'person': return 'blue';
      case 'place': return 'emerald';
      case 'project': return 'purple';
      case 'promise': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">StoryGraph</h2>
            <p className="text-sm text-gray-600">Your knowledge map of people, places, projects & promises</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-purple-600 font-medium">Phase 2 - Q2 2026</span>
        </div>
      </div>

      {/* Competitive Advantage */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Revolutionary Advantage</span>
        </div>
        <p className="text-sm text-purple-800 mb-3">
          <strong>No competitor offers autobiographical memory mapping.</strong> While others train abstract skills, 
          StoryGraph connects your memories to real relationships, projects, and commitments.
        </p>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-purple-700">
          <div>• <strong>Context-aware memory resurfacing</strong></div>
          <div>• <strong>Relationship and project tracking</strong></div>
          <div>• <strong>Smart memory recommendations</strong></div>
          <div>• <strong>Visual knowledge navigation</strong></div>
        </div>
      </div>

      {/* Demo Toggle */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showDemo ? 'Hide Preview' : 'See Interactive Demo'}
        </button>
      </div>

      {showDemo ? (
        <div className="space-y-6">
          {/* Demo Interface */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Your StoryGraph (Demo)</h3>
              <div className="text-sm text-gray-500">{sampleNodes.length} nodes connected</div>
            </div>
            
            {/* Node Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {sampleNodes.map((node) => {
                const IconComponent = getNodeIcon(node.type);
                const color = getNodeColor(node.type);
                
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedNode?.id === node.id
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-4 h-4 text-${color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{node.name}</h3>
                          <span className={`text-xs px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full capitalize`}>
                            {node.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: node.importance }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 text-${color}-500 fill-current`} />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{node.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{node.memoryCount} memories</span>
                      <span>{node.connections.length} connections</span>
                    </div>
                    
                    {node.nextAction && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <div className="text-xs font-medium text-yellow-800">Next Action:</div>
                        <div className="text-xs text-yellow-700">{node.nextAction}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Node Details */}
            {selectedNode && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{selectedNode.name}</h3>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    Create Memory
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Last Interaction</div>
                    <div className="text-gray-600">{selectedNode.lastInteraction.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Importance</div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: selectedNode.importance }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded border border-indigo-200">
                  <div className="text-xs font-medium text-indigo-800 mb-1">🧠 AI Insight:</div>
                  <div className="text-xs text-indigo-700">
                    {selectedNode.type === 'person' && "This person appears in 3 of your memories. Consider scheduling a follow-up conversation."}
                    {selectedNode.type === 'project' && "High-priority project with upcoming deadline. Perfect for implementation intention planning."}
                    {selectedNode.type === 'place' && "This location has positive memory associations. Good for focused work sessions."}
                    {selectedNode.type === 'promise' && "Weekly commitment - consider setting up automatic reminders and tracking."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">How StoryGraph Works</span>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>Automatic connections:</strong> When you create memories, AI identifies people, places, and projects</p>
              <p>• <strong>Smart resurfacing:</strong> "You're meeting Sarah again - here's your last conversation details"</p>
              <p>• <strong>Context awareness:</strong> Suggests relevant memories based on location, calendar, or current activity</p>
              <p>• <strong>Relationship intelligence:</strong> Tracks interaction patterns and suggests follow-ups</p>
            </div>
          </div>

          {/* Competitive Comparison */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-emerald-900">vs. Competitors</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-800">
              <div>
                <div className="font-medium mb-1">🧠 Other Apps:</div>
                <div className="space-y-1 text-xs">
                  <div>• Abstract puzzles and games</div>
                  <div>• Generic skill training</div>
                  <div>• No real-world context</div>
                  <div>• Points and leaderboards</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">🎯 Eidolon StoryGraph:</div>
                <div className="space-y-1 text-xs">
                  <div>• Your actual relationships and projects</div>
                  <div>• Context-aware memory suggestions</div>
                  <div>• Real-world application tracking</div>
                  <div>• Meaningful progress measurement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revolutionary Memory Intelligence</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Imagine your memories automatically connecting to people, places, and projects. 
            When you meet Sarah again, Eidolon surfaces your last conversation details.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-purple-900 mb-2">🔗 Smart Connections</div>
              <div className="text-sm text-purple-800">Automatically links memories to your life context</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900 mb-2">🎯 Context Awareness</div>
              <div className="text-sm text-blue-800">Surfaces relevant memories when you need them</div>
            </div>
          </div>
        </div>
      )}

      {/* Early Access */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Star className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-900">Early Access Preview</span>
        </div>
        <p className="text-yellow-800 mb-4">
          StoryGraph represents the future of memory training - moving beyond games to genuine life enhancement. 
          Be among the first to experience this revolutionary approach.
        </p>
        <button
          onClick={onEarlyAccess}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
        >
          Request Early Access to StoryGraph
        </button>
      </div>

      {/* Technical Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Development Status</span>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• <strong>Phase 2 Feature:</strong> Planned for Q2 2026 release</p>
          <p>• <strong>Current Status:</strong> Concept validation and early prototyping</p>
          <p>• <strong>Early Access:</strong> Available to beta testers in Q1 2026</p>
          <p>• <strong>Integration:</strong> Will work seamlessly with existing memory weaves</p>
        </div>
      </div>
    </div>
  );
};

export default StoryGraphPreview;