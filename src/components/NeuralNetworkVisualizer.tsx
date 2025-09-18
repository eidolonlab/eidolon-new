import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Target, TrendingUp, Activity, Eye, Sparkles } from 'lucide-react';

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  activation: number;
  type: 'input' | 'hidden' | 'output';
  label: string;
}

interface NeuralConnection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

interface NeuralNetworkVisualizerProps {
  memoryData: {
    visual: string;
    auditory: string;
    emotional: string;
    narrative: string;
  };
  onNetworkStrength: (strength: number) => void;
}

const NeuralNetworkVisualizer: React.FC<NeuralNetworkVisualizerProps> = ({
  memoryData,
  onNetworkStrength
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [connections, setConnections] = useState<NeuralConnection[]>([]);
  const [networkStrength, setNetworkStrength] = useState(0);
  const [activationPattern, setActivationPattern] = useState<string>('building');
  const [synapticActivity, setSynapticActivity] = useState(0);

  useEffect(() => {
    initializeNetwork();
    animateNetwork();
  }, []);

  useEffect(() => {
    updateNetworkActivation();
  }, [memoryData]);

  const initializeNetwork = () => {
    // Create neural network structure representing memory formation
    const inputNodes: NeuralNode[] = [
      { id: 'visual', x: 50, y: 100, activation: 0, type: 'input', label: 'Visual Cortex' },
      { id: 'auditory', x: 50, y: 200, activation: 0, type: 'input', label: 'Auditory Cortex' },
      { id: 'emotional', x: 50, y: 300, activation: 0, type: 'input', label: 'Limbic System' },
      { id: 'temporal', x: 50, y: 400, activation: 0, type: 'input', label: 'Temporal Lobe' }
    ];

    const hiddenNodes: NeuralNode[] = [
      { id: 'hippocampus', x: 200, y: 150, activation: 0, type: 'hidden', label: 'Hippocampus' },
      { id: 'prefrontal', x: 200, y: 250, activation: 0, type: 'hidden', label: 'Prefrontal Cortex' },
      { id: 'amygdala', x: 200, y: 350, activation: 0, type: 'hidden', label: 'Amygdala' }
    ];

    const outputNodes: NeuralNode[] = [
      { id: 'memory', x: 350, y: 200, activation: 0, type: 'output', label: 'Consolidated Memory' },
      { id: 'retrieval', x: 350, y: 300, activation: 0, type: 'output', label: 'Retrieval Pathway' }
    ];

    const allNodes = [...inputNodes, ...hiddenNodes, ...outputNodes];
    setNodes(allNodes);

    // Create connections
    const newConnections: NeuralConnection[] = [
      // Input to hidden
      { from: 'visual', to: 'hippocampus', strength: 0.8, active: false },
      { from: 'auditory', to: 'hippocampus', strength: 0.7, active: false },
      { from: 'emotional', to: 'amygdala', strength: 0.9, active: false },
      { from: 'temporal', to: 'prefrontal', strength: 0.6, active: false },
      
      // Hidden to hidden
      { from: 'hippocampus', to: 'prefrontal', strength: 0.8, active: false },
      { from: 'amygdala', to: 'hippocampus', strength: 0.7, active: false },
      
      // Hidden to output
      { from: 'hippocampus', to: 'memory', strength: 0.9, active: false },
      { from: 'prefrontal', to: 'retrieval', strength: 0.8, active: false },
      { from: 'amygdala', to: 'memory', strength: 0.6, active: false }
    ];

    setConnections(newConnections);
  };

  const updateNetworkActivation = () => {
    const activations = {
      visual: Math.min(memoryData.visual.length / 50, 1),
      auditory: Math.min(memoryData.auditory.length / 50, 1),
      emotional: Math.min(memoryData.emotional.length / 50, 1),
      temporal: Math.min(memoryData.narrative.length / 100, 1)
    };

    // Calculate network strength
    const totalActivation = Object.values(activations).reduce((sum, val) => sum + val, 0);
    const strength = (totalActivation / 4) * 100;
    setNetworkStrength(strength);
    onNetworkStrength(strength);

    // Update nodes
    setNodes(prev => prev.map(node => ({
      ...node,
      activation: activations[node.id as keyof typeof activations] || 
                 (node.type === 'hidden' ? totalActivation * 0.6 : totalActivation * 0.8)
    })));

    // Update connections
    setConnections(prev => prev.map(conn => ({
      ...conn,
      active: activations[conn.from as keyof typeof activations] > 0.3
    })));

    // Set activation pattern
    if (strength > 80) setActivationPattern('optimal');
    else if (strength > 50) setActivationPattern('building');
    else setActivationPattern('weak');
  };

  const animateNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = conn.active ? 
            `rgba(99, 102, 241, ${conn.strength})` : 
            'rgba(156, 163, 175, 0.3)';
          ctx.lineWidth = conn.active ? 3 : 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        
        const intensity = node.activation;
        if (node.type === 'input') {
          ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
        } else if (node.type === 'hidden') {
          ctx.fillStyle = `rgba(147, 51, 234, ${0.3 + intensity * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + intensity * 0.7})`;
        }
        
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Neural Network Visualization</h3>
          <p className="text-sm text-gray-600">Watch your memory form in real-time</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <canvas
            ref={canvasRef}
            width={400}
            height={500}
            className="border border-gray-200 rounded-lg bg-gray-50"
          />
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            activationPattern === 'optimal' ? 'bg-emerald-50 border-emerald-200' :
            activationPattern === 'building' ? 'bg-blue-50 border-blue-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Activity className={`w-4 h-4 ${
                activationPattern === 'optimal' ? 'text-emerald-600' :
                activationPattern === 'building' ? 'text-blue-600' :
                'text-yellow-600'
              }`} />
              <span className={`font-medium ${
                activationPattern === 'optimal' ? 'text-emerald-900' :
                activationPattern === 'building' ? 'text-blue-900' :
                'text-yellow-900'
              }`}>
                Network Status: {activationPattern === 'optimal' ? 'Optimal Encoding' :
                                activationPattern === 'building' ? 'Building Connections' :
                                'Weak Activation'}
              </span>
            </div>
            <div className="text-2xl font-bold mb-2">
              <span className={
                activationPattern === 'optimal' ? 'text-emerald-600' :
                activationPattern === 'building' ? 'text-blue-600' :
                'text-yellow-600'
              }>
                {networkStrength.toFixed(0)}%
              </span>
            </div>
            <p className={`text-sm ${
              activationPattern === 'optimal' ? 'text-emerald-800' :
              activationPattern === 'building' ? 'text-blue-800' :
              'text-yellow-800'
            }`}>
              {activationPattern === 'optimal' ? 
                'Excellent! Multiple brain regions are strongly connected.' :
                activationPattern === 'building' ?
                'Good progress! Neural pathways are forming.' :
                'Add more sensory details to strengthen neural connections.'
              }
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Brain Region Activity</h4>
            {[
              { id: 'visual', label: 'Visual Cortex', value: Math.min(memoryData.visual.length / 50, 1) * 100 },
              { id: 'auditory', label: 'Auditory Cortex', value: Math.min(memoryData.auditory.length / 50, 1) * 100 },
              { id: 'emotional', label: 'Limbic System', value: Math.min(memoryData.emotional.length / 50, 1) * 100 },
              { id: 'narrative', label: 'Language Centers', value: Math.min(memoryData.narrative.length / 100, 1) * 100 }
            ].map(region => (
              <div key={region.id}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{region.label}</span>
                  <span>{region.value.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      region.value > 80 ? 'bg-emerald-500' :
                      region.value > 50 ? 'bg-blue-500' :
                      region.value > 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${region.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-indigo-900">Neuroplasticity Insights</span>
            </div>
            <div className="text-xs text-indigo-800 space-y-1">
              <p>• <strong>Synaptic strength:</strong> {networkStrength > 70 ? 'Strong connections forming' : 'Building neural pathways'}</p>
              <p>• <strong>Memory consolidation:</strong> {networkStrength > 80 ? 'Optimal for long-term storage' : 'Developing consolidation'}</p>
              <p>• <strong>Retrieval efficiency:</strong> {networkStrength > 60 ? 'Multiple access pathways' : 'Single pathway forming'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualizer;