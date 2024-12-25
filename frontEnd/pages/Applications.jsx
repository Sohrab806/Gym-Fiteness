import React, { useState, useEffect } from "react";
import { Layout, Table, Button, message, Space } from "antd";
import axios from "axios";

const { Content } = Layout;

const TrainerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/trainers`);
        if (response.data.success) {
          setApplications(response.data.data);
        } else {
          message.error("Failed to fetch applications.");
        }
      } catch (error) {
        message.error("Something went wrong while fetching applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAccept = async (email) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/trainers/accept`, { email });
      if (response.data.success) {
        message.success("Application accepted successfully!");
        setApplications((prev) => prev.filter((app) => app.email !== email));
      } else {
        message.error("Failed to accept application.");
      }
    } catch (error) {
      message.error("Something went wrong while accepting the application.");
    }
  };

  const handleReject = async (email) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/trainers/reject`, { data: { email } });
      if (response.data.success) {
        message.success("Application rejected successfully!");
        setApplications((prev) => prev.filter((app) => app.email !== email));
      } else {
        message.error("Failed to reject application.");
      }
    } catch (error) {
      message.error("Something went wrong while rejecting the application.");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => new Date(dob).toLocaleDateString(),
    },
    {
      title: "Certifications",
      dataIndex: "certifications",
      key: "certifications",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Training Areas",
      dataIndex: "trainingAreas",
      key: "trainingAreas",
      render: (areas) => areas.join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleAccept(record.email)}>
            Accept
          </Button>
          <Button type="danger" onClick={() => handleReject(record.email)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          background: "#fff",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: "700", color: "#333" }}>
          Trainer Applications
        </h2>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey={(record) => record._id}
          loading={loading}
        />
      </Content>
    </Layout>
  );
};

export default TrainerApplications;
