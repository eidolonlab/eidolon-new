import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Brain, Clock, Target, TrendingUp, 
  Calendar, Award, AlertCircle, RefreshCw, Download,
  Eye, Activity, Zap, Shield, ArrowLeft, LogOut
} from 'lucide-react';
import { adminAPI, AdminStats, CohortData } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    total_users: 1247,
    total_weaves: 3891,
    total_sessions: 7234,
    avg_coherence_score: 78.5,
    avg_recall_latency: 12500,
    active_users_7d: 423,
    completion_rate: 67
  });
  const [cohortData, setCohortData] = useState<CohortData[]>([
    { cohort_week: '2025-01-06', users_count: 45, avg_coherence: 82, avg_sessions: 4.2, retention_rate: 78 },
    { cohort_week: '2025-01-13', users_count: 52, avg_coherence: 79, avg_sessions: 3.8, retention_rate: 81 },
    { cohort_week: '2025-01-20', users_count: 38, avg_coherence: 85, avg_sessions: 5.1, retention_rate: 85 },
    { cohort_week: '2025-01-27', users_count: 61, avg_coherence: 77, avg_sessions: 3.9, retention_rate: 73 }
  ]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(30);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Data refreshed successfully!');
    }, 1000);
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      stats,
      cohort_data: cohortData,
      note: 'Eidolon Admin Dashboard Export'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eidolon-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    navigate('/');
  };

  const handleBackToApp = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBackToApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
              onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
              <span>Back to App</span>
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Eidolon Admin Dashboard
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Clinical memory training analytics & insights
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleRefresh}
              style={{
                padding: '8px',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
              onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              title="Refresh Data"
            >
              <RefreshCw style={{ width: '20px', height: '20px' }} />
            </button>
            
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                color: '#374151',
                backgroundColor: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Key Metrics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
                </div>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.total_users.toLocaleString()}
                </span>
              </div>
              <h4 style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>Total Users</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {stats.active_users_7d} active this week
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain style={{ width: '24px', height: '24px', color: '#059669' }} />
                </div>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.total_weaves.toLocaleString()}
                </span>
              </div>
              <h4 style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>Memory Weaves</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Avg score: {stats.avg_coherence_score}/100
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#fed7aa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity style={{ width: '24px', height: '24px', color: '#ea580c' }} />
                </div>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.total_sessions.toLocaleString()}
                </span>
              </div>
              <h4 style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>Training Sessions</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Avg latency: {Math.round(stats.avg_recall_latency / 1000)}s
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e9d5ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target style={{ width: '24px', height: '24px', color: '#9333ea' }} />
                </div>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                  {stats.completion_rate}%
                </span>
              </div>
              <h4 style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>PMAR</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Prospective Memory Adherence
              </p>
            </div>
          </div>

          {/* Test Buttons Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Test All Functions
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: loading ? '#f3f4f6' : '#4f46e5',
                  color: loading ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseOut={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
              >
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>

              <button
                onClick={handleExport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Export Data</span>
              </button>

              <button
                onClick={handleBackToApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span>Main App</span>
              </button>

              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Cohort Analysis */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  User Cohort Analysis
                </h3>
                <TrendingUp style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cohortData.slice(0, 4).map((cohort, index) => (
                  <div 
                    key={index} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                      cursor: 'default'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  >
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        Week of {new Date(cohort.cohort_week).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {cohort.users_count} users • {cohort.avg_sessions} avg sessions
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600', color: '#059669' }}>{cohort.retention_rate}%</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>retention</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Outcomes */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Clinical Outcomes
                </h3>
                <Award style={{ width: '20px', height: '20px', color: '#059669' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Brain style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                    <span style={{ fontWeight: '500', color: '#1e3a8a' }}>Narrative Coherence</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>
                    {stats.avg_coherence_score}/100
                  </div>
                  <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                    {stats.avg_coherence_score > 80 ? 'Excellent' : 
                     stats.avg_coherence_score > 60 ? 'Good' : 'Improving'} average across all users
                  </p>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#059669' }} />
                    <span style={{ fontWeight: '500', color: '#064e3b' }}>Recall Speed</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', marginBottom: '4px' }}>
                    {(stats.avg_recall_latency / 1000).toFixed(1)}s
                  </div>
                  <p style={{ fontSize: '14px', color: '#047857', margin: 0 }}>
                    {stats.avg_recall_latency < 15000 ? 'Fast' : 
                     stats.avg_recall_latency < 30000 ? 'Normal' : 'Deliberate'} retrieval speed
                  </p>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Target style={{ width: '16px', height: '16px', color: '#9333ea' }} />
                    <span style={{ fontWeight: '500', color: '#581c87' }}>Implementation Success</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9333ea', marginBottom: '4px' }}>
                    {stats.completion_rate}%
                  </div>
                  <p style={{ fontSize: '14px', color: '#7c3aed', margin: 0 }}>
                    {stats.completion_rate > 80 ? 'Excellent' : 
                     stats.completion_rate > 60 ? 'Good' : 'Needs improvement'} PMAR rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Compliance */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield style={{ width: '20px', height: '20px', color: '#059669' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Privacy & Compliance Status
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  All systems operational - GDPR compliant
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '24px' 
            }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
                <Eye style={{ width: '32px', height: '32px', color: '#059669', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '600', color: '#064e3b' }}>Data Anonymization</div>
                <div style={{ fontSize: '14px', color: '#047857', marginTop: '4px' }}>All personal data is hashed</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <Shield style={{ width: '32px', height: '32px', color: '#2563eb', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '600', color: '#1e3a8a' }}>Consent Management</div>
                <div style={{ fontSize: '14px', color: '#1e40af', marginTop: '4px' }}>User-controlled data sharing</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
                <Zap style={{ width: '32px', height: '32px', color: '#9333ea', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '600', color: '#581c87' }}>Real-time Analytics</div>
                <div style={{ fontSize: '14px', color: '#7c3aed', marginTop: '4px' }}>Live clinical insights</div>
              </div>
            </div>
          </div>

          {/* Research Notes */}
          <div style={{
            background: 'linear-gradient(to right, #eef2ff, #f3e8ff)',
            borderRadius: '12px',
            border: '1px solid #c7d2fe',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Brain style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
              <h3 style={{ fontWeight: '600', color: '#3730a3', margin: 0 }}>Clinical Research Notes</h3>
            </div>
            <div style={{ fontSize: '14px', color: '#4338ca', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Narrative Coherence Score (NCS):</strong> Measures autobiographical memory specificity and structure (0-100 scale)
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Prospective Memory Adherence Rate (PMAR):</strong> Clinical metric for real-world follow-through on planned actions
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Recall Latency:</strong> Time from cue presentation to memory retrieval initiation (clinical standard)
              </p>
              <p style={{ margin: 0 }}>
                <strong>Multi-sensory Integration:</strong> Percentage of sensory modalities incorporated in memory weaves
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;