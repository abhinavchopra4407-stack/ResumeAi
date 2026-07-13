import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../common/Card';

export const ActivityChart = ({ data }) => {
  // Fallback default activity data if none passed
  const chartData = data && data.length > 0 ? data : [
    { name: 'Mon', scans: 1, score: 65 },
    { name: 'Tue', scans: 2, score: 72 },
    { name: 'Wed', scans: 1, score: 70 },
    { name: 'Thu', scans: 3, score: 81 },
    { name: 'Fri', scans: 2, score: 85 },
    { name: 'Sat', scans: 0, score: 0 },
    { name: 'Sun', scans: 1, score: 88 },
  ].filter(d => d.scans > 0 || d.name === 'Mon' || d.name === 'Sun'); // Keep it clean

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400">{payload[0].payload.name}</p>
          <p className="text-sm font-bold text-violet-400 mt-1">Scans: {payload[0].value}</p>
          {payload[1] && (
            <p className="text-sm font-bold text-emerald-400">Avg Score: {payload[1].value}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-white">Analysis Activity</h4>
          <p className="text-xs text-slate-500">Resume scanning history and performance metrics</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="scans" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScans)" 
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ActivityChart;
