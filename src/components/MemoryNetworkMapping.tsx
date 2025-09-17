import React, { useState, useEffect } from 'react';
import { Network, Brain, Link, Target, Eye, Zap, Calendar, Users, MapPin } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface MemoryNode {
  id: string;
  title: string;
  type: 'memory' | 'person' | 'location' | 'emotion' | 'theme';
  connections: string[];
  strength: number;
  x: number;
  y: number;
  color: string;
}

interface MemoryConnection {
  from: string;
  to: string;
  strength: number;
  type: 'temporal' | 'thematic' | 'emotional' | 'spatial';
}

const MemoryNetworkMapping: React.FC = () => {
  const { weaves } = useWeave();
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [connections, setConnections] = useState<MemoryConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    totalConnections: 0,
    strongestCluster: '',
    networkDensity: 0
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (weaves.length >= 3) {
      generateMemoryNetwork();
    }
  }, [weaves]);

  const generateMemoryNetwork = () => {
    const newNodes: MemoryNode[] = [];
    const newConnections: MemoryConnection[] = [];

    // Create memory nodes
    weaves.forEach((weave, index) => {
      newNodes.push({
        id: weave.id,
        title: weave.title,
        type: 'memory',
        connections: [],
        strength: weave.coherenceScore,
        x: Math.cos((index / weaves.length) * 2 * Math.PI) * 150 + 200,
        y: Math.sin((index / weaves.length) * 2 * Math.PI) * 150 + 200,
        color: weave.type === 'past' ? '#4f46e5' : '#059669'
      });
    });

    // Extract and create entity nodes (people, locations, themes)
    const entities = new Map<string, { type: 'person' | 'location' | 'emotion' | 'theme'; memories: string[]; strength: number }>();

    weaves.forEach(weave => {
      // Extract people
      if (weave.bridgeData?.peopleInvolved) {
        weave.bridgeData.peopleInvolved.forEach(person => {
          if (!entities.has(person)) {
            entities.set(person, { type: 'person', memories: [], strength: 0 });
          }
          entities.get(person)!.memories.push(weave.id);
          entities.get(person)!.strength += weave.coherenceScore;
        });
      }

      // Extract locations
      if (weave.cues?.location?.name) {
        const location = weave.cues.location.name;
        if (!entities.has(location)) {
          entities.set(location, { type: 'location', memories: [], strength: 0 });
        }
        entities.get(location)!.memories.push(weave.id);
        entities.get(location)!.strength += weave.coherenceScore;
      }

      // Extract emotions
      if (weave.sensoryDetails.emotional) {
        const emotions = extractEmotions(weave.sensoryDetails.emotional);
        emotions.forEach(emotion => {
          if (!entities.has(emotion)) {
            entities.set(emotion, { type: 'emotion', memories: [], strength: 0 });
          }
          entities.get(emotion)!.memories.push(weave.id);
          entities.get(emotion)!.strength += weave.coherenceScore;
        });
      }

      // Extract themes from tags
      weave.tags.forEach(tag => {
        if (!entities.has(tag)) {
          entities.set(tag, { type: 'theme', memories: [], strength: 0 });
        }
        entities.get(tag)!.memories.push(weave.id);
        entities.get(tag)!.strength += weave.coherenceScore;
      });
    });

    // Create entity nodes
    let entityIndex = 0;
    entities.forEach((entity, name) => {
      if (entity.memories.length > 1) { // Only show entities connected to multiple memories
        const angle = (entityIndex / entities.size) * 2 * Math.PI;
        newNodes.push({
          id: `entity-${name}`,
          title: name,
          type: entity.type,
          connections: entity.memories,
          strength: entity.strength / entity.memories.length,
          x: Math.cos(angle) * 100 + 200,
          y: Math.sin(angle) * 100 + 200,
          color: getEntityColor(entity.type)
        });
        entityIndex++;
      }
    });

    // Create connections
    entities.forEach((entity, name) => {
      if (entity.memories.length > 1) {
        entity.memories.forEach(memoryId => {
          newConnections.push({
            from: memoryId,
            to: `entity-${name}`,
            strength: entity.strength / entity.memories.length,
            type: getConnectionType(entity.type)
          });
        });
      }
    });

    // Find temporal connections (memories close in time)
    weaves.forEach((weave1, i) => {
      weaves.forEach((weave2, j) => {
        if (i !== j) {
          const timeDiff = Math.abs(weave1.createdAt.getTime() - weave2.createdAt.getTime());
          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
          
          if (daysDiff <= 7) { // Memories within a week
            newConnections.push({
              from: weave1.id,
              to: weave2.id,
              strength: Math.max(0, 100 - daysDiff * 10),
              type: 'temporal'
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setConnections(newConnections);

    // Calculate network statistics
    setNetworkStats({
      totalNodes: newNodes.length,
      totalConnections: newConnections.length,
      strongestCluster: findStrongestCluster(newNodes, newConnections),
      networkDensity: (newConnections.length / (newNodes.length * (newNodes.length - 1))) * 100
    });
  };

  const extractEmotions = (emotionalText: string): string[] => {
    const emotionKeywords = [
      'happy', 'joy', 'excited', 'calm', 'peaceful', 'love', 'grateful',
      'nervous', 'anxious', 'worried', 'sad', 'frustrated', 'angry',
      'surprised', 'amazed', 'curious', 'confident', 'proud', 'content'
    ];
    
    return emotionKeywords.filter(emotion => 
      emotionalText.toLowerCase().includes(emotion)
    );
  };

  const getEntityColor = (type: 'person' | 'location' | 'emotion' | 'theme') => {
    switch (type) {
      case 'person': return '#f59e0b';
      case 'location': return '#10b981';
      case 'emotion': return '#ef4444';
      case 'theme': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getConnectionType = (entityType: 'person' | 'location' | 'emotion' | 'theme'): MemoryConnection['type'] => {
    switch (entityType) {
      case 'person': return 'thematic';
      case 'location': return 'spatial';
      case 'emotion': return 'emotional';
      case 'theme': return 'thematic';
      default: return 'thematic';
    }
  };

  const findStrongestCluster = (nodes: MemoryNode[], connections: MemoryConnection[]): string => {
    // Find the entity with the most connections
    const entityNodes = nodes.filter(n => n.type !== 'memory');
    if (entityNodes.length === 0) return 'No clusters yet';
    
    const strongest = entityNodes.reduce((prev, current) => 
      current.connections.length > prev.connections.length ? current : prev
    );
    
    return `${strongest.title} (${strongest.connections.length} memories)`;
  };

  const getNodeIcon = (type: MemoryNode['type']) => {
    switch (type) {
      case 'memory': return Brain;
      case 'person': return Users;
      case 'location': return MapPin;
      case 'emotion': return Eye;
      case 'theme': return Target;
      default: return Brain;
    }
  };

  if (weaves.length < 3) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Memory Network Analysis</h3>
          <p className="text-gray-600">
            Create at least 3 memories to unlock your personal memory network visualization
          </p>
          <div className="text-sm text-gray-500 mt-2">
            {3 - weaves.length} more memories needed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Memory Network</h2>
            <p className="text-sm text-gray-600">Visualize connections between your memories</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showAnalysis ? 'Hide' : 'Show'} Analysis
        </button>
      </div>

      {/* Network Visualization */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden" style={{ height: '400px' }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Render connections */}
          {connections.map((connection, index) => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={connection.type === 'temporal' ? '#6b7280' : '#d1d5db'}
                strokeWidth={Math.max(1, connection.strength / 20)}
                opacity={0.6}
              />
            );
          })}
          
          {/* Render nodes */}
          {nodes.map((node) => {
            const IconComponent = getNodeIcon(node.type);
            const isSelected = selectedNode === node.id;
            
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.type === 'memory' ? 20 : 15}
                  fill={node.color}
                  stroke={isSelected ? '#1f2937' : 'white'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                />
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 pointer-events-none"
                >
                  {node.title.length > 12 ? node.title.substring(0, 12) + '...' : node.title}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs font-medium text-gray-900 mb-2">Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span>Past Memory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Future Scenario</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Person</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            const connectedNodes = connections
              .filter(c => c.from === selectedNode || c.to === selectedNode)
              .map(c => c.from === selectedNode ? c.to : c.from)
              .map(id => nodes.find(n => n.id === id))
              .filter(Boolean);
            
            return (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: node.color + '20' }}>
                    {(() => {
                      const IconComponent = getNodeIcon(node.type);
                      return <IconComponent className="w-4 h-4" style={{ color: node.color }} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{node.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{node.type} • Strength: {Math.round(node.strength)}</p>
                  </div>
                </div>
                
                {connectedNodes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Connected to:</p>
                    <div className="flex flex-wrap gap-2">
                      {connectedNodes.map((connectedNode) => (
                        <button
                          key={connectedNode!.id}
                          onClick={() => setSelectedNode(connectedNode!.id)}
                          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                          {connectedNode!.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Network Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Network className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-600">{networkStats.totalNodes}</div>
          <div className="text-xs text-gray-600">Network Nodes</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Link className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-600">{networkStats.totalConnections}</div>
          <div className="text-xs text-gray-600">Connections</div>
        </div>
        
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-600">{networkStats.networkDensity.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Network Density</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-600 text-xs leading-tight">{networkStats.strongestCluster}</div>
          <div className="text-xs text-gray-600">Strongest Cluster</div>
        </div>
      </div>

      {/* Detailed Analysis */}
      {showAnalysis && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Network Analysis</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>Memory Clustering:</strong> Your memories show {
                networkStats.networkDensity > 15 ? 'strong thematic clustering' :
                networkStats.networkDensity > 8 ? 'moderate clustering patterns' :
                'emerging connection patterns'
              }. This indicates {
                networkStats.networkDensity > 15 ? 'well-integrated autobiographical memory networks' :
                'developing memory organization that will strengthen with more content'
              }.
            </div>
            <div>
              <strong>Retrieval Pathways:</strong> You have {networkStats.totalConnections} connection pathways, 
              providing {networkStats.totalConnections > 20 ? 'excellent' : networkStats.totalConnections > 10 ? 'good' : 'basic'} 
              redundancy for memory access.
            </div>
            <div>
              <strong>Cognitive Architecture:</strong> Your strongest memory cluster is {networkStats.strongestCluster}, 
              suggesting this is a central organizing theme in your autobiographical memory system.
            </div>
          </div>
        </div>
      )}

      {/* Research Context */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Memory Network Science</span>
        </div>
        <p className="text-sm text-blue-800">
          Memory networks in the brain are organized by semantic, temporal, and emotional associations. 
          Visualizing these connections helps identify strong retrieval pathways and areas where 
          additional memory weaving could strengthen your overall autobiographical memory system.
        </p>
      </div>
    </div>
  );
};

export default MemoryNetworkMapping;