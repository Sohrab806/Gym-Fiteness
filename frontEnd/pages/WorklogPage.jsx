import React, { useState } from 'react';

// Helper function to calculate total calories by week or month
const calculateTotalCalories = (logs, timeFrame) => {
  const caloriesByTimeFrame = {};

  logs.forEach((log) => {
    const date = new Date(log.date);
    let timeFrameKey;

    if (timeFrame === 'week') {
      const weekNumber = getWeekNumber(date);
      timeFrameKey = `${date.getFullYear()}-W${weekNumber}`;
    } else if (timeFrame === 'month') {
      timeFrameKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }

    if (!caloriesByTimeFrame[timeFrameKey]) caloriesByTimeFrame[timeFrameKey] = 0;
    caloriesByTimeFrame[timeFrameKey] += log.calories;
  });

  return caloriesByTimeFrame;
};

// Helper function to get the ISO week number
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const WorklogPage = () => {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [filterTimeFrame, setFilterTimeFrame] = useState('week');

  // Function to add workout log (for testing)
  const addWorkoutLog = (type, duration) => {
    const newLog = {
      type: type,
      duration: duration,
      date: new Date().toISOString().split('T')[0],
      calories: calculateCalories(type, duration),
    };

    setWorkoutLogs([newLog, ...workoutLogs]);
  };

  // Function to calculate calories burned based on workout type and duration
  const calculateCalories = (type, duration) => {
    const caloriesPerMinute = {
      running: 10,
      cycling: 8,
      yoga: 5,
      swimming: 12,
      walking: 4,
    };
    return (caloriesPerMinute[type] || 5) * duration;
  };

  // Filter logs based on selected timeframe
  const totalCalories = calculateTotalCalories(workoutLogs, filterTimeFrame);

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '40px auto',
        padding: '24px',
        background: 'linear-gradient(to right, #86efac, #bbf7d0, #d1fae5)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
      }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '32px' }}>
        Workout Logs
      </h1>

      {/* Timeframe Filter */}
      <div
        style={{
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'box-shadow 0.3s',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>Filter by Timeframe</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <button
            onClick={() => setFilterTimeFrame('week')}
            style={{
              width: '33%',
              padding: '12px 0',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '8px',
              backgroundColor: filterTimeFrame === 'week' ? '#16a34a' : '#f3f4f6',
              color: filterTimeFrame === 'week' ? '#ffffff' : '#374151',
              boxShadow: filterTimeFrame === 'week' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilterTimeFrame('month')}
            style={{
              width: '33%',
              padding: '12px 0',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '8px',
              backgroundColor: filterTimeFrame === 'month' ? '#16a34a' : '#f3f4f6',
              color: filterTimeFrame === 'month' ? '#ffffff' : '#374151',
              boxShadow: filterTimeFrame === 'month' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Workout Logs Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>Exercise History</h2>
        {workoutLogs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #e5e7eb' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0fdf4' }}>
                  <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px', color: '#374151' }}>Date</th>
                  <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px', color: '#374151' }}>Type</th>
                  <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px', color: '#374151' }}>Duration</th>
                  <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px', color: '#374151' }}>Calories</th>
                </tr>
              </thead>
              <tbody>
                {workoutLogs.map((log, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff' }}>
                    <td style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>{log.date}</td>
                    <td style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>{log.type}</td>
                    <td style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>{log.duration}</td>
                    <td style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 16px', fontWeight: '600', color: '#16a34a' }}>{log.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No workout logs yet. Add a workout to get started!</p>
        )}
      </div>
    </div>
  );
};

export default WorklogPage;
