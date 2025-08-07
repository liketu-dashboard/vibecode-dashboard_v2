import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import StatsCard from './StatsCard';
import Chart from './Chart';

const Dashboard = () => {
  const [data, setData] = useState({
    dailyActiveUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalRewards: 0,
    previousDayUsers: 0,
    charts: {
      dailyActiveUsers: [],
      postsCreated: [],
      dailyComments: [],
      dailyRewards: []
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('90D');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsAPI.getAnalytics(selectedPeriod);
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const calculatePercentageChange = () => {
    if (data.previousDayUsers === 0) return 0;
    return ((data.dailyActiveUsers - data.previousDayUsers) / data.previousDayUsers * 100).toFixed(1);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Please check your backend connection and HiveSQL configuration.
          </p>
          <button 
            onClick={fetchAnalytics}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Liketu Analytics</h1>
            <p className="text-sm text-gray-500">Hive Blockchain Social Dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['7D', '30D', '90D', 'All'].map((period) => (
            <button 
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded ${
                selectedPeriod === period 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
          <button 
            onClick={fetchAnalytics}
            className="ml-2 p-1 text-gray-600 hover:bg-gray-100 rounded"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Daily Active Users"
          value={formatNumber(data.dailyActiveUsers)}
          change={parseFloat(calculatePercentageChange())}
          icon={Users}
          color="red"
          loading={loading}
        />
        <StatsCard
          title="Total Posts"
          value={formatNumber(data.totalPosts)}
          icon={FileText}
          color="teal"
          loading={loading}
        />
        <StatsCard
          title="Total Comments"
          value={formatNumber(data.totalComments)}
          icon={MessageSquare}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Total Rewards (HBD)"
          value={formatNumber(data.totalRewards)}
          icon={DollarSign}
          color="red"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          title="Daily Active Users"
          data={data.charts.dailyActiveUsers}
          type="line"
          color="#ef4444"
          loading={loading}
        />
        <Chart
          title="Posts Created Daily"
          data={data.charts.postsCreated}
          type="bar"
          color="#14b8a6"
          loading={loading}
        />
        <Chart
          title="Daily Comments"
          data={data.charts.dailyComments}
          type="line"
          color="#06b6d4"
          loading={loading}
        />
        <Chart
          title="Daily Rewards (HBD)"
          data={data.charts.dailyRewards}
          type="bar"
          color="#f97316"
          loading={loading}
        />
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        Data sourced from Hive Blockchain via HiveSQL • Updated in real time
      </div>
    </div>
  );
};

export default Dashboard;
