// Tailwind CSS for Workout Page Styling
import React, { useState } from 'react';

const WorkoutPage = () => {
  // State for managing workout logs and inputs
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Function to calculate calories burned
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

  // Function to add a new workout log
  const addWorkoutLog = () => {
    if (!workoutType || !duration) return alert('Please fill out all fields.');

    const newLog = {
      type: workoutType,
      duration: parseInt(duration),
      date: new Date().toISOString().split('T')[0],
      calories: calculateCalories(workoutType, parseInt(duration)),
    };

    setWorkoutLogs([newLog, ...workoutLogs]);
    setWorkoutType('');
    setDuration('');
  };

  // Function to filter logs
  const filteredLogs = workoutLogs.filter(log => {
    return (
      (!filterType || log.type === filterType) &&
      (!filterDate || log.date === filterDate)
    );
  });

  // Calculate calories by day
  const caloriesByDay = workoutLogs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.calories;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-green-300 via-green-100 to-green-400 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Workout Logging</h1>

      {/* Workout Logging Form */}
      <div className="mb-8 bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Log Your Workout</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-gray-600">Workout Type:</span>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Type</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="yoga">Yoga</option>
              <option value="swimming">Swimming</option>
              <option value="walking">Walking</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-600">Duration (minutes):</span>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>
        </div>
        <button
          onClick={addWorkoutLog}
          className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Log Workout
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-8 bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filter Workouts</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-gray-600">Filter by Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Types</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="yoga">Yoga</option>
              <option value="swimming">Swimming</option>
              <option value="walking">Walking</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-600">Filter by Date:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>
      </div>

      {/* Exercise History */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Exercise History</h2>
        {filteredLogs.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Duration (min)</th>
                <th className="border border-gray-300 px-4 py-2">Calories Burned</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className="even:bg-gray-50 hover:bg-blue-50">
                  <td className="border border-gray-300 px-4 py-2">{log.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.duration}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No logs to display.</p>
        )}
      </div>

      {/* Calories by Day */}
      <div className="mt-8 bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Calories Burned by Day</h2>
        <ul className="space-y-2">
          {/* Check if there are any logs and if not, create a placeholder day */}
          {Object.entries(caloriesByDay).length > 0 ? (
            Object.entries(caloriesByDay).map(([date, calories], index) => (
              <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md shadow-sm">
                <span className="text-gray-700">{date}</span>
                <span className="font-semibold text-green-600">{calories} calories</span>
              </li>
            ))
          ) : (
            <li className="flex justify-between bg-gray-100 p-2 rounded-md shadow-sm">
              <span className="text-gray-700">No workouts logged yet</span>
              <span className="font-semibold text-green-600">0 calories</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutPage;