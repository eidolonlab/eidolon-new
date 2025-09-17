import React, { useState, useEffect } from 'react';
import { Target, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle, Award } from 'lucide-react';
import { useWeave } from '../contexts/WeaveContext';

interface PMARMetrics {
  today: number;
  sevenDay: number;
  twentyEightDay: number;
  totalPlanned: number;
  totalCompleted: number;
  averageLatency: number;
  streak: number;
}

const PMARDashboard: React.FC = () => {
  const { weaves } = useWeave();
  const [pmarMetrics, setPmarMetrics] = useState<PMARMetrics>({
    today: 0,
    sevenDay: 0,
    twentyEightDay: 0,
    totalPlanned: 0,
    totalCompleted: 0,
    averageLatency: 0,
    streak: 0
  });

  useEffect(() => {
    calculatePMARMetrics();
  }, [weaves]);

  const calculatePMARMetrics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twentyEightDaysAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);

    const futureWeaves = weaves.filter(w => w.type === 'future' && w.scheduledFor);
    
    // Today's PMAR
    const todayPlanned = futureWeaves.filter(w => {
      const scheduledDate = new Date(w.scheduledFor!);
      return scheduledDate >= today && scheduledDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });
    const todayCompleted = todayPlanned.filter(w => w.completed);
    const todayPMAR = todayPlanned.length > 0 ? (todayCompleted.length / todayPlanned.length) * 100 : 0;

    // 7-day PMAR
    const sevenDayPlanned = futureWeaves.filter(w => {
      const scheduledDate = new Date(w.scheduledFor!);
      return scheduledDate >= sevenDaysAgo && scheduledDate <= now;
    });
    const sevenDayCompleted = sevenDayPlanned.filter(w => w.completed);
    const sevenDayPMAR = sevenDayPlanned.length > 0 ? (sevenDayCompleted.length / sevenDayPlanned.length) * 100 : 0;

    // 28-day PMAR
    const twentyEightDayPlanned = futureWeaves.filter(w => {
      const scheduledDate = new Date(w.scheduledFor!);
      return scheduledDate >= twentyEightDaysAgo && scheduledDate <= now;
    });
    const twentyEightDayCompleted = twentyEightDayPlanned.filter(w => w.completed);
    const twentyEightDayPMAR = twentyEightDayPlanned.length > 0 ? (twentyEightDayCompleted.length / twentyEightDayPlanned.length) * 100 : 0;

    // Calculate streak
    let streak = 0;
    const sortedCompletedWeaves = futureWeaves
      .filter(w => w.completed && w.scheduledFor)
      .sort((a, b) => b.scheduledFor!.getTime() - a.scheduledFor!.getTime());

    for (let i = 0; i < sortedCompletedWeaves.length; i++) {
      const weaveDate = new Date(sortedCompletedWeaves[i].scheduledFor!);
      const daysDiff = Math.floor((now.getTime() - weaveDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= i + 1) {
        streak++;
      } else {
        break;
      }
    }

    setPmarMetrics({
      today: Math.round(todayPMAR),
      sevenDay: Math.round(sevenDayPMAR),
      twentyEightDay: Math.round(twentyEightDayPMAR),
      totalPlanned: futureWeaves.length,
      totalCompleted: futureWeaves.filter(w => w.completed).length,
      averageLatency: 0, // TODO: Calculate from actual initiation latency data
      streak
    });
  };

  const getPMARColor = (pmar: number) => {
    if (pmar >= 80) return 'emerald';
    if (pmar >= 60) return 'yellow';
    if (pmar >= 40) return 'orange';
    return 'red';
  };

  const getPMARLabel = (pmar: number) => {
    if (pmar >= 80) return 'Excellent';
    if (pmar >= 60) return 'Good';
    if (pmar >= 40) return 'Improving';
    return 'Needs Focus';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Prospective Memory Adherence Rate (PMAR)</h2>
            <p className="text-sm text-gray-600">Clinical metric for follow-through on planned actions</p>
          </div>
        </div>
        {pmarMetrics.streak > 0 && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 rounded-lg">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">{pmarMetrics.streak} day streak!</span>
          </div>
        )}
      </div>

      {/* Main PMAR Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Today */}
        <div className={`p-6 rounded-xl border-2 border-${getPMARColor(pmarMetrics.today)}-200 bg-${getPMARColor(pmarMetrics.today)}-50`}>
          <div className="flex items-center justify-between mb-4">
            <Calendar className={`w-6 h-6 text-${getPMARColor(pmarMetrics.today)}-600`} />
            <span className={`text-xs font-medium px-2 py-1 bg-${getPMARColor(pmarMetrics.today)}-100 text-${getPMARColor(pmarMetrics.today)}-700 rounded-full`}>
              {getPMARLabel(pmarMetrics.today)}
            </span>
          </div>
          <div className={`text-3xl font-bold text-${getPMARColor(pmarMetrics.today)}-600 mb-2`}>
            {pmarMetrics.today}%
          </div>
          <div className="text-sm text-gray-600">Today's PMAR</div>
          <div className="text-xs text-gray-500 mt-1">
            Follow-through on today's planned actions
          </div>
        </div>

        {/* 7-Day */}
        <div className={`p-6 rounded-xl border-2 border-${getPMARColor(pmarMetrics.sevenDay)}-200 bg-${getPMARColor(pmarMetrics.sevenDay)}-50`}>
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className={`w-6 h-6 text-${getPMARColor(pmarMetrics.sevenDay)}-600`} />
            <span className={`text-xs font-medium px-2 py-1 bg-${getPMARColor(pmarMetrics.sevenDay)}-100 text-${getPMARColor(pmarMetrics.sevenDay)}-700 rounded-full`}>
              {getPMARLabel(pmarMetrics.sevenDay)}
            </span>
          </div>
          <div className={`text-3xl font-bold text-${getPMARColor(pmarMetrics.sevenDay)}-600 mb-2`}>
            {pmarMetrics.sevenDay}%
          </div>
          <div className="text-sm text-gray-600">7-Day PMAR</div>
          <div className="text-xs text-gray-500 mt-1">
            Weekly consistency trend
          </div>
        </div>

        {/* 28-Day */}
        <div className={`p-6 rounded-xl border-2 border-${getPMARColor(pmarMetrics.twentyEightDay)}-200 bg-${getPMARColor(pmarMetrics.twentyEightDay)}-50`}>
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className={`w-6 h-6 text-${getPMARColor(pmarMetrics.twentyEightDay)}-600`} />
            <span className={`text-xs font-medium px-2 py-1 bg-${getPMARColor(pmarMetrics.twentyEightDay)}-100 text-${getPMARColor(pmarMetrics.twentyEightDay)}-700 rounded-full`}>
              {getPMARLabel(pmarMetrics.twentyEightDay)}
            </span>
          </div>
          <div className={`text-3xl font-bold text-${getPMARColor(pmarMetrics.twentyEightDay)}-600 mb-2`}>
            {pmarMetrics.twentyEightDay}%
          </div>
          <div className="text-sm text-gray-600">28-Day PMAR</div>
          <div className="text-xs text-gray-500 mt-1">
            Monthly performance baseline
          </div>
        </div>
      </div>

      {/* Clinical Context & Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Clinical Context</span>
          </div>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>PMAR ≥80%:</strong> Excellent prospective memory function</p>
            <p><strong>PMAR 60-79%:</strong> Good with room for improvement</p>
            <p><strong>PMAR &lt;60%:</strong> May benefit from enhanced if-then planning</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-900">Performance Summary</span>
          </div>
          <div className="text-sm text-emerald-800 space-y-1">
            <p><strong>Total Scenarios:</strong> {pmarMetrics.totalPlanned}</p>
            <p><strong>Completed:</strong> {pmarMetrics.totalCompleted}</p>
            <p><strong>Overall Rate:</strong> {pmarMetrics.totalPlanned > 0 ? Math.round((pmarMetrics.totalCompleted / pmarMetrics.totalPlanned) * 100) : 0}%</p>
            <p><strong>Current Streak:</strong> {pmarMetrics.streak} days</p>
          </div>
        </div>
      </div>

      {/* Research Citation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600">
          <strong>Research Foundation:</strong> Implementation intentions (if-then planning) reliably improve prospective memory performance across populations. 
          PMAR tracking enables objective measurement of real-world follow-through improvements.
        </div>
      </div>
    </div>
  );
};

export default PMARDashboard;