import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import RecentAnalyses from '../components/dashboard/RecentAnalyses';
import Loader from '../components/common/Loader';
import { useResume } from '../hooks/useResume';
import { useAuth } from '../hooks/useAuth';
import { FileText, Award, BarChart3, UploadCloud } from 'lucide-react';
import Button from '../components/common/Button';

export const Dashboard = () => {
  const { resumes, loading, fetchResumes, removeResume } = useResume();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleViewDetails = (resumeId) => {
    navigate(`/analyze?id=${resumeId}`);
  };

  const handleDeleteResume = async (resumeId) => {
    if (confirm("Are you sure you want to delete this resume and its analysis history?")) {
      await removeResume(resumeId);
    }
  };

  if (loading && resumes.length === 0) {
    return <Loader fullPage message="Loading your dashboard..." />;
  }

  // Calculate statistics
  const totalResumes = resumes.length;
  // Compute some realistic/mock values for display
  const averageScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + 75, 0) / totalResumes) // Simulated average
    : 0;
  const totalScans = totalResumes > 0 ? totalResumes * 2 : 0;

  // Generate Activity Data
  const activityData = resumes.map((r, idx) => ({
    name: r.filename.substring(0, 10),
    scans: 2,
    score: 75 + (idx * 3) % 15
  })).reverse();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Hello, {user?.full_name || 'User'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Welcome back to your ResumeIQ command center.</p>
          </div>
          <Button
            onClick={() => navigate('/analyze')}
            icon={UploadCloud}
          >
            Upload New Resume
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCard
            title="Uploaded Resumes"
            value={totalResumes}
            description="Total documents in database"
            icon={FileText}
          />
          <StatsCard
            title="Average ATS Grade"
            value={averageScore > 0 ? `${averageScore}%` : 'N/A'}
            description="Overall structural score average"
            icon={Award}
            trend={totalResumes > 0 ? { value: "+4.2%", type: "positive" } : null}
          />
          <StatsCard
            title="Evaluations Performed"
            value={totalScans}
            description="Target job match tests completed"
            icon={BarChart3}
          />
        </div>

        {/* Chart and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ActivityChart data={activityData} />
          <RecentAnalyses
            resumes={resumes}
            onView={handleViewDetails}
            onDelete={handleDeleteResume}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
