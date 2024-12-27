import React, { useState, useEffect } from "react";
import { Layout, Table, message, Spin } from "antd";
import axios from "axios";

const { Content } = Layout;

const ApprovedCourses = () => {
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchApprovedCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/courses/approved`);
        if (response.data.success) {
          setApprovedCourses(response.data.data);
        } else {
          message.error("Failed to fetch approved courses.");
        }
      } catch (error) {
        message.error("Something went wrong while fetching approved courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCourses();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trainer Email",
      dataIndex: "trainerEmail",
      key: "trainerEmail",
    },
    {
      title: "Duration (Hours)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Approval Status",
      dataIndex: "approval",
      key: "approval",
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
          Approved Courses
        </h2>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Table
            columns={columns}
            dataSource={approvedCourses}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ApprovedCourses;
