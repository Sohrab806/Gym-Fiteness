import React, { useState } from "react";

const ViewPage = () => {
    const initialUserData = {
        name: "John Doe",
        workoutsCompleted: 5,
        totalWorkouts: 10,
        caloriesBurned: 1200,
        targetCalories: 2000,
        weeklyWorkouts: 20,
        monthlyWorkouts: 80,
        weeklyTarget: 25,
        monthlyTarget: 100,
        dailySteps: 8000,
        dailyStepGoal: 10000,
        dailyCalorieGoal: 2500,
        dailyCaloriesConsumed: 2200,
        dailyWorkoutMinutes: 45,
        dailyWorkoutGoal: 60,
    };

    const exerciseHistory = [
        { date: "2024-06-01", activity: "Running", duration: "30 mins" },
        { date: "2024-06-02", activity: "Cycling", duration: "45 mins" },
        { date: "2024-06-03", activity: "Yoga", duration: "60 mins" },
    ];

    const [userData, setUserData] = useState(initialUserData);
    const [filters, setFilters] = useState({ date: "", activity: "" });

    const handleGoalChange = (e, goalType) => {
        const value = e.target.value;
        setUserData((prev) => ({ ...prev, [goalType]: value }));
    };

    const assessFitness = () => {
        const { dailyWorkoutMinutes, dailyWorkoutGoal } = userData;
        if (dailyWorkoutMinutes >= dailyWorkoutGoal * 0.8) {
            return {
                level: "Excellent",
                message: "Fantastic work! You’re hitting your daily goals consistently.",
            };
        } else if (dailyWorkoutMinutes >= dailyWorkoutGoal * 0.5) {
            return {
                level: "Good",
                message: "You're doing well but aim to push a little harder to meet your goals.",
            };
        } else {
            return {
                level: "Needs Improvement",
                message: "Try to be more active and focus on smaller, achievable daily goals.",
            };
        }
    };

    const assessment = assessFitness();

    const dailyStepProgress = (userData.dailySteps / userData.dailyStepGoal) * 100;
    const calorieProgress = (userData.dailyCaloriesConsumed / userData.dailyCalorieGoal) * 100;
    const workoutProgress = (userData.dailyWorkoutMinutes / userData.dailyWorkoutGoal) * 100;

    const filteredHistory = exerciseHistory.filter(
        (entry) =>
            (filters.date === "" || entry.date === filters.date) &&
            (filters.activity === "" || entry.activity.toLowerCase().includes(filters.activity.toLowerCase()))
    );

    return (
        <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
        

            {/* Main Content */}
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                <h2 style={{ color: "#38a169" }}>Welcome, {userData.name}!</h2>

                {/* Goal Setting */}
                <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                    <h3 style={{ color: "#38a169" }}>Set Daily Goals</h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                            <label>Step Goal:</label>
                            <input
                                type="number"
                                value={userData.dailyStepGoal}
                                onChange={(e) => handleGoalChange(e, "dailyStepGoal")}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div>
                            <label>Calorie Intake Goal:</label>
                            <input
                                type="number"
                                value={userData.dailyCalorieGoal}
                                onChange={(e) => handleGoalChange(e, "dailyCalorieGoal")}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div>
                            <label>Workout Duration Goal (mins):</label>
                            <input
                                type="number"
                                value={userData.dailyWorkoutGoal}
                                onChange={(e) => handleGoalChange(e, "dailyWorkoutGoal")}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => alert("Daily goals updated successfully!")}
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "#38a169",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "5px",
                            border: "none",
                        }}
                    >
                        Save Goals
                    </button>
                </div>

                {/* Daily Progress */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", flex: "1" }}>
                        <h3 style={{ color: "#38a169" }}>Steps</h3>
                        <p>{userData.dailySteps} / {userData.dailyStepGoal}</p>
                        <div style={{ backgroundColor: "#e2e8f0", height: "10px", borderRadius: "5px" }}>
                            <div
                                style={{ backgroundColor: "#38a169", height: "10px", width: `${dailyStepProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", flex: "1" }}>
                        <h3 style={{ color: "#38a169" }}>Calories</h3>
                        <p>{userData.dailyCaloriesConsumed} / {userData.dailyCalorieGoal} kcal</p>
                        <div style={{ backgroundColor: "#e2e8f0", height: "10px", borderRadius: "5px" }}>
                            <div
                                style={{ backgroundColor: "#38a169", height: "10px", width: `${calorieProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", flex: "1" }}>
                        <h3 style={{ color: "#38a169" }}>Workout</h3>
                        <p>{userData.dailyWorkoutMinutes} / {userData.dailyWorkoutGoal} mins</p>
                        <div style={{ backgroundColor: "#e2e8f0", height: "10px", borderRadius: "5px" }}>
                            <div
                                style={{ backgroundColor: "#38a169", height: "10px", width: `${workoutProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Exercise History */}
                <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", marginTop: "2rem" }}>
                    <h3 style={{ color: "#38a169" }}>Exercise History</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#edf2f7" }}>
                                <th style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>Date</th>
                                <th style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>Activity</th>
                                <th style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((exercise, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>{exercise.date}</td>
                                    <td style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>{exercise.activity}</td>
                                    <td style={{ padding: "0.5rem", border: "1px solid #e2e8f0" }}>{exercise.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ViewPage;
