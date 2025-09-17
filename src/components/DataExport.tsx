import React, { useState } from 'react';
import { Download, FileText, Database, Shield, Calendar } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

const DataExport: React.FC = () => {
  const { weaves, retrievalSessions } = useWeave();
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [includePersonalData, setIncludePersonalData] = useState(true);

  const generateExportData = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        totalWeaves: weaves.length,
        totalSessions: retrievalSessions.length,
        includesPersonalData: includePersonalData,
      },
      weaves: weaves.map(weave => ({
        id: weave.id,
        type: weave.type,
        title: includePersonalData ? weave.title : '[REDACTED]',
        seed: includePersonalData ? weave.seed : '[REDACTED]',
        narrative: includePersonalData ? weave.narrative : '[REDACTED]',
        sensoryDetails: includePersonalData ? weave.sensoryDetails : {
          visual: '[REDACTED]',
          auditory: '[REDACTED]',
          olfactory: '[REDACTED]',
          tactile: '[REDACTED]',
          emotional: '[REDACTED]',
        },
        createdAt: weave.createdAt.toISOString(),
        lastRetrieved: weave.lastRetrieved?.toISOString(),
        retrievalCount: weave.retrievalCount,
        coherenceScore: weave.coherenceScore,
        tags: includePersonalData ? weave.tags : [],
        completed: weave.completed,
        scheduledFor: weave.scheduledFor?.toISOString(),
        errorlessMode: weave.errorlessMode,
        difficultyLevel: weave.difficultyLevel,
      })),
      retrievalSessions: retrievalSessions.map(session => ({
        id: session.id,
        weaveId: session.weaveId,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime?.toISOString(),
        latencyMs: session.latencyMs,
        detailsRecalled: session.detailsRecalled,
        accuracy: session.accuracy,
        difficulty: session.difficulty,
      })),
    };

    return exportData;
  };

  const downloadJSON = () => {
    const data = generateExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eidolon-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const data = generateExportData();
    
    // Convert weaves to CSV
    const weavesCSV = [
      'ID,Type,Title,Seed,Created,Retrieval Count,Coherence Score,Completed,Difficulty',
      ...data.weaves.map(w => [
        w.id,
        w.type,
        `"${w.title.replace(/"/g, '""')}"`,
        `"${w.seed.replace(/"/g, '""')}"`,
        w.createdAt,
        w.retrievalCount,
        w.coherenceScore,
        w.completed || false,
        w.difficultyLevel || 'medium'
      ].join(','))
    ].join('\n');

    // Convert sessions to CSV
    const sessionsCSV = [
      'ID,Weave ID,Start Time,Latency (ms),Details Recalled,Accuracy,Difficulty',
      ...data.retrievalSessions.map(s => [
        s.id,
        s.weaveId,
        s.startTime,
        s.latencyMs,
        s.detailsRecalled,
        s.accuracy,
        s.difficulty
      ].join(','))
    ].join('\n');

    const combinedCSV = `WEAVES\n${weavesCSV}\n\nRETRIEVAL SESSIONS\n${sessionsCSV}`;
    
    const blob = new Blob([combinedCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eidolon-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      downloadJSON();
    } else {
      downloadCSV();
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL your memory training data? This cannot be undone.')) {
      localStorage.removeItem('eidolon-weaves');
      localStorage.removeItem('eidolon-sessions');
      localStorage.removeItem('eidolon-consent');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
      </div>

      <div className="space-y-6">
        {/* Export Section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Export Your Data</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value as 'json')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">JSON (Complete)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value as 'csv')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">CSV (Spreadsheet)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includePersonal"
                checked={includePersonalData}
                onChange={(e) => setIncludePersonalData(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="includePersonal" className="text-sm text-gray-700">
                Include personal memory content (uncheck for anonymized export)
              </label>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Data Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Your Data Summary</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">Memory Weaves</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">{weaves.length}</div>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">Training Sessions</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{retrievalSessions.length}</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Storage</span>
              </div>
              <div className="text-sm font-bold text-orange-600">Local Device</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-red-900 mb-4">Danger Zone</h3>
          
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-900 mb-2">Delete All Data</h4>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete all your memory weaves, training sessions, and app preferences. 
              This action cannot be undone.
            </p>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;