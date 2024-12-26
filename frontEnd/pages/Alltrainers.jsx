import React, { useEffect, useState } from "react";
import { Button, Card, message, Spin } from "antd";
import axios from "axios";

const TrainerListForm = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/trainers/gettrainers"
      );
      if (response.data.success) {
        setTrainers(response.data.data || []);
      } else {
        message.error("Failed to fetch trainers.");
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      message.error("Error fetching trainers.");
    } finally {
      setLoading(false);
    }
  };

  const handleFireTrainer = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/trainers/fire",
        { email }
      );
      if (response.data.success) {
        message.success("Trainer fired successfully.");
        fetchTrainers();
      } else {
        message.error("Failed to fire trainer.");
      }
    } catch (error) {
      console.error("Error firing trainer:", error);
      message.error("Error firing trainer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h2>Trainer Management</h2>
      {loading ? (
        <Spin size="large" />
      ) : trainers.length > 0 ? (
        trainers.map((trainer) => (
          <Card
            key={trainer._id}
            style={{
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ color: "#1890ff" }}>{trainer.name}</h3>
            <p>
              <strong>Email:</strong> {trainer.email}
            </p>
            <p>
              <strong>Phone:</strong> {trainer.phone || "N/A"}
            </p>
            <p>
              <strong>Certifications:</strong>{" "}
              {trainer.certifications || "N/A"}
            </p>
            <p>
              <strong>Experience:</strong> {trainer.experience || "N/A"}
            </p>
            <p>
              <strong>Training Areas:</strong>{" "}
              {trainer.trainingAreas
                ? trainer.trainingAreas.join(", ")
                : "N/A"}
            </p>
            <Button
              type="primary"
              danger // Makes the button red
              onClick={() => handleFireTrainer(trainer.email)}
            >
              Fire
            </Button>
          </Card>
        ))
      ) : (
        <p>No trainers found.</p>
      )}
    </div>
  );
};

export default TrainerListForm;
