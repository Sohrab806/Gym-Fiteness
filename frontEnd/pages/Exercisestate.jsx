import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Layout, Card, Spin, Typography, Row, Col } from "antd";
import { Chart as ChartJS } from "chart.js/auto";

const { Content } = Layout;
const { Title, Text } = Typography;

const ExerciseStatistics = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.get("http://localhost:5000/api/exercise", {
          params: { email },
        });

        if (response.data && response.data.data) {
          const allData = response.data.data;

          // Filter the data for the last 7 days
          const filteredData = allData.filter((entry) => {
            const exerciseDate = new Date(entry.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return exerciseDate >= sevenDaysAgo;
          });

          setExerciseData(filteredData);
        } else {
          console.warn("No exercise data found in the response");
          setExerciseData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (exerciseData.length === 0) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
        <Content style={{ padding: "20px" }}>
          <Row justify="center" align="middle">
            <Col span={24} style={{ textAlign: "center" }}>
              <Card
                title={<Title level={3}>Your Dashboard</Title>}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                }}
              >
                <Text>No exercise data available for the last 7 days.</Text>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  // Count exercise frequency
  const exerciseFrequency = {};
  exerciseData.forEach((entry) => {
    entry.exercises.forEach((exercise) => {
      if (exerciseFrequency[exercise.name]) {
        exerciseFrequency[exercise.name] += 1;
      } else {
        exerciseFrequency[exercise.name] = 1;
      }
    });
  });

  const exerciseNames = Object.keys(exerciseFrequency);
  const exerciseCounts = exerciseNames.map((name) => exerciseFrequency[name]);

  const chartData = {
    labels: exerciseNames,
    datasets: [
      {
        label: "Days Exercised",
        data: exerciseCounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          color: "#555",
          maxRotation: 90,  // Rotate labels if there are too many
          minRotation: 45,
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
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Content style={{ padding: "20px" }}>
        <Row justify="center" align="middle">
          <Col span={24}>
            <Card
              title={<Title level={3}>Your Dashboard</Title>}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <Text>
                Welcome to your dashboard. You can add other content here.
              </Text>
            </Card>
          </Col>
        </Row>

        <Row justify="center" align="middle">
          <Col span={24}>
            <Card
              title={<Title level={4}>Exercise Frequency (Last 7 Days)</Title>}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  overflowX: "auto",  // Enable horizontal scrolling
                }}
              >
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ExerciseStatistics;
