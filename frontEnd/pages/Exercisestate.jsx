import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Layout, Card, Spin, Typography, Row, Col, Form, Input, Button } from "antd";
import { Chart as ChartJS } from "chart.js/auto";

const { Content } = Layout;
const { Title, Text } = Typography;

const ExerciseStatistics = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idealWeightRange, setIdealWeightRange] = useState(null);
  const [weightDifference, setWeightDifference] = useState(null);

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

  useEffect(() => {
    if (idealWeightRange || weightDifference) {
      const timer = setTimeout(() => {
        setIdealWeightRange(null);
        setWeightDifference(null);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [idealWeightRange, weightDifference]);

  const calculateIdealWeight = (values) => {
    const heightInMeters = values.height / 100; // Convert cm to meters
    const minWeight = (18.5 * Math.pow(heightInMeters, 2)).toFixed(1);
    const maxWeight = (24.9 * Math.pow(heightInMeters, 2)).toFixed(1);
    setIdealWeightRange({ min: minWeight, max: maxWeight });

    const currentWeight = parseFloat(values.currentWeight);
    let difference = null;
    if (currentWeight < minWeight) {
      difference = `You need to gain ${(minWeight - currentWeight).toFixed(1)} kg to reach the minimum healthy weight.`;
    } else if (currentWeight > maxWeight) {
      difference = `You need to lose ${(currentWeight - maxWeight).toFixed(1)} kg to reach the maximum healthy weight.`;
    } else {
      difference = "Your weight is within the healthy range!";
    }
    setWeightDifference(difference);
  };

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
        backgroundColor: "#2E8B57",
        borderColor: "#2E8B57",
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
          color: "#2E8B57",
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          color: "#2E8B57",
        },
      },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Content style={{ padding: "20px" }}>
        <Row justify="center" align="middle">
          <Col span={24}>
            <Card
              style={{
                height: "60vh",
                backgroundImage: "url('/src/assets/more.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "#ffffff",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <Text>Welcome to your dashboard. You can add other content here.</Text>
            </Card>
            <div>
              <Card title={<Title level={3}>Weight Tracker</Title>}>
                <Form layout="vertical" onFinish={calculateIdealWeight}>
                  <Form.Item
                    label="Height (in cm)"
                    name="height"
                    rules={[{ required: true, message: "Please enter your height!" }]}
                  >
                    <Input type="number" placeholder="e.g., 170" />
                  </Form.Item>
                  <Form.Item
                    label="Current Weight (in kg)"
                    name="currentWeight"
                    rules={[{ required: true, message: "Please enter your current weight!" }]}
                  >
                    <Input type="number" placeholder="e.g., 70" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Calculate
                  </Button>
                </Form>

                {idealWeightRange && (
                  <div style={{ marginTop: "20px" }}>
                    <Text>
                      Your ideal weight range is between{" "}
                      <b>
                        {idealWeightRange.min} kg - {idealWeightRange.max} kg
                      </b>
                      .
                    </Text>
                    <br />
                    <Text>{weightDifference}</Text>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>

        <Row justify="center" align="middle">
          <Col span={24}>
            <Card
              title={<Title level={4}>Exercise Frequency (Last 7 Days)</Title>}
              style={{
                backgroundColor: "white",
                padding: "20px",
              }}
            >
              <div style={{ width: "100%", height: "400px", overflowX: "auto" }}>
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
