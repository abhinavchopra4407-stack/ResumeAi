import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ATSScore = ({ breakdown = {}, resumeId }) => {
  const [loading, setLoading] = useState(!breakdown || Object.keys(breakdown).length === 0);
  const [scoreData, setScoreData] = useState(breakdown);
  
  useEffect(() => {
    if (breakdown && Object.keys(breakdown).length > 0) {
      setScoreData(breakdown);
      setLoading(false);
    }
  }, [breakdown]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4">Loading ATS scorecard...</p>
      </div>
    );
  }

  // Map breakdown keys to display names
  const metricLabels = {
    'formatting': 'Structure & Formatting',
    'contact_details': 'Contact Details',
    'core_skills_depth': 'Core Skills Depth',
    'action_verbs_impact': 'Action Verbs & Impact',
    'experience_depth': 'Experience Depth',
    'education': 'Education',
    'projects': 'Projects',
    'certifications': 'Certifications'
  };

  // Prepare data for the pie chart
  const pieData = {
    labels: Object.keys(scoreData).map(key => metricLabels[key] || key.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        data: Object.values(scoreData).map(val => Math.round(val)),
        backgroundColor: [
          '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b',
          '#10b981', '#6366f1', '#14b8a6', '#f472b6'
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for the bar chart
  const barData = {
    labels: Object.keys(scoreData).map(key => metricLabels[key] || key.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        label: 'Score',
        data: Object.values(scoreData).map(val => Math.round(val)),
        backgroundColor: Object.values(scoreData).map(val => 
          val >= 20 ? '#10b981' : 
          val >= 15 ? '#f59e0b' : 
          '#ef4444'
        ),
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Score: ${context.parsed.y}/30`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${Math.round(value)}/30`;
          }
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">METRIC BREAKDOWN</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Scores by Category</h4>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/5 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Score Distribution</h4>
            <div className="h-64 flex items-center justify-center">
              <div className="w-64">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(scoreData).map(([key, value]) => (
            <div key={key} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  {metricLabels[key] || key.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-lg font-bold text-primary-500">
                  {Math.round(value)}/30
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(value / 30) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSScore;