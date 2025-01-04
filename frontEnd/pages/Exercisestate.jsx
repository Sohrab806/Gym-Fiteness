import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Layout, Card, Spin, Typography } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

const ExerciseStatistics = ({ email }) => {
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await axios.get(`/api/exercises/statistics`, { params: { email } });
        const allData = response.data.data;

        // Filter the data for the last 7 days
        const filteredData = allData.filter((entry) => {
          const exerciseDate = new Date(entry.date);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return exerciseDate >= sevenDaysAgo;
        });

        setExerciseData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [email]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Prepare data for the chart
  const dates = exerciseData.map((entry) => entry.date);
  const exerciseCounts = exerciseData.map((entry) => entry.exercises.length);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Exercises per Day",
        data: exerciseCounts,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF5733"],
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF5733"],
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          color: "#555",
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          color: "#555",
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Content style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Top Two-Thirds Section */}
          <Card
            title={<Title level={3}>Your Dashboard</Title>}
            style={{ flex: 2, backgroundColor: "#ffffff" }}
          >
            <Text>Welcome to your dashboard. You can add other content here.</Text>
            {/* Add more components or content as needed */}
          </Card>

          {/* Bottom One-Third Section */}
          <Card
            title={<Title level={4}>Exercise Statistics (Last 7 Days)</Title>}
            style={{ flex: 1, textAlign: "center", backgroundColor: "#ffffff" }}
          >
            <div style={{ transform: "scale(0.7)", transformOrigin: "top left", width: "100%", height: "100%" }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default ExerciseStatistics;
