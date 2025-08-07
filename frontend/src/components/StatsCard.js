import React from 'react';

const StatsCard = ({ title, value, change, icon: Icon, color, loading }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change !== undefined && (
                <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{change}% {change >= 0 ? '↗' : '↘'}
                </p>
              )}
            </>
          )}
        </div>
        <div className={`w-10 h-10 bg-${color}-50 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-500`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
