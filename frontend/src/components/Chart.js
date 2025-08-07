import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Chart = ({ title, data, type = 'line', color = '#ef4444', loading }) => {
  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {loading ? (
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              {type === 'bar' ? (
                <Bar dataKey="value" fill={color} />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2}
                  dot={false}
                />
              )}
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Chart;
