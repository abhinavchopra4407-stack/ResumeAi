import React from 'react';
import Card from '../common/Card';

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend = null, // e.g. { value: "+12%", type: "positive" }
}) => {
  return (
    <Card hoverEffect>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/15">
          <Icon className="h-6 w-6 text-violet-400" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center space-x-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
            trend.type === 'positive' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
          }`}>
            {trend.value}
          </span>
          <span className="text-xs text-slate-500">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
