import React, { useState, useEffect } from 'react';
import { Users, MapPin, Briefcase, Target, Plus, Search, Filter, Calendar, Heart, Brain, Zap, Eye, Link, Star } from 'lucide-react';

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

interface StoryGraphProps {
  onNodeSelect: (node: StoryNode) => void;
  onCreateMemory: (nodeId: string) => void;
}

const StoryGraph: React.FC<StoryGraphProps> = ({ onNodeSelect, onCreateMemory }) => {
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'person' | 'place' | 'project' | 'promise'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNode, setNewNode] = useState({
    type: 'person' as StoryNode['type'],
    name: '',
    description: '',
    tags: [] as string[],
    importance: 3,
    context: {}
  });

  useEffect(() => {
    loadStoryGraph();
  }, []);

  const loadStoryGraph = () => {
    const saved = localStorage.getItem('eidolon-story-graph');
    if (saved) {
      const parsed = JSON.parse(saved).map((node: any) => ({
        ...node,
        lastInteraction: new Date(node.lastInteraction),
        context: {
          ...node.context,
          deadline: node.context.deadline ? new Date(node.context.deadline) : undefined
        }
      }));
      setNodes(parsed);
    } else {
      // Create sample nodes
      const sampleNodes: StoryNode[] = [
        {
          id: 'person-1',
          type: 'person',
          name: 'Sarah Johnson',
          description: 'Project manager at TechCorp, loves hiking',
          tags: ['work', 'colleague', 'mentor'],
          connections: ['project-1'],
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
        }
      ];
      setNodes(sampleNodes);
      localStorage.setItem('eidolon-story-graph', JSON.stringify(sampleNodes));
    }
  };

  const saveStoryGraph = (newNodes: StoryNode[]) => {
    setNodes(newNodes);
    localStorage.setItem('eidolon-story-graph', JSON.stringify(newNodes));
  };

  const addNode = () => {
    if (!newNode.name.trim()) return;

    const node: StoryNode = {
      id: `${newNode.type}-${Date.now()}`,
      type: newNode.type,
      name: newNode.name.trim(),
      description: newNode.description.trim(),
      tags: newNode.tags,
      connections: [],
      lastInteraction: new Date(),
      importance: newNode.importance,
      memoryCount: 0,
      context: newNode.context
    };

    saveStoryGraph([...nodes, node]);
    setNewNode({
      type: 'person',
      name: '',
      description: '',
      tags: [],
      importance: 3,
      context: {}
    });
    setShowAddForm(false);
  };

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

  const filteredNodes = nodes.filter(node => {
    const matchesType = filterType === 'all' || node.type === filterType;
    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

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
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Node</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your story graph..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="person">People</option>
          <option value="place">Places</option>
          <option value="project">Projects</option>
          <option value="promise">Promises</option>
        </select>
      </div>

      {/* Story Graph Visualization */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredNodes.map((node) => {
          const IconComponent = getNodeIcon(node.type);
          const color = getNodeColor(node.type);
          
          return (
            <button
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                onNodeSelect(node);
              }}
              className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
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
              
              {node.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {node.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{selectedNode.name}</h3>
            <button
              onClick={() => onCreateMemory(selectedNode.id)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Create Memory
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Last Interaction</div>
              <div className="text-sm text-gray-600">{selectedNode.lastInteraction.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Importance</div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: selectedNode.importance }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Node Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to StoryGraph</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['person', 'place', 'project', 'promise'] as const).map((type) => {
                    const IconComponent = getNodeIcon(type);
                    const color = getNodeColor(type);
                    
                    return (
                      <button
                        key={type}
                        onClick={() => setNewNode(prev => ({ ...prev, type }))}
                        className={`p-3 rounded-lg border transition-all ${
                          newNode.type === type
                            ? `border-${color}-500 bg-${color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 text-${color}-600 mx-auto mb-1`} />
                        <div className="text-sm font-medium capitalize">{type}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newNode.name}
                  onChange={(e) => setNewNode(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`Enter ${newNode.type} name...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newNode.description}
                  onChange={(e) => setNewNode(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description or context..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setNewNode(prev => ({ ...prev, importance: level }))}
                      className={`w-8 h-8 rounded-full transition-colors ${
                        level <= newNode.importance 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4 text-white mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addNode}
                  disabled={!newNode.name.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add to StoryGraph
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
    </div>
  );
};

export default StoryGraph;