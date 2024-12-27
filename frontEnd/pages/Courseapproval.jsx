import React, { useState, useEffect } from "react";
import { Layout, Table, Button, message, Space } from "antd";
import axios from "axios";

const { Content } = Layout;

const CourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/courses/pending`);
        if (response.data.success) {
          setCourses(response.data.data); // Ensure "data" contains courses
        } else {
          message.error("Failed to fetch courses.");
        }
      } catch (error) {
        message.error("Something went wrong while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleApprove = async (email, courseId) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/courses/approve`, {
        email,
        courseId,
      });
      if (response.data.success) {
        message.success("Course approved successfully!");
        setCourses((prev) => prev.filter((course) => course._id !== courseId));
      } else {
        message.error("Failed to approve course.");
      }
    } catch (error) {
      message.error("Something went wrong while approving the course.");
    }
  };

  const handleReject = async (email, courseId) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/courses/reject`, {
        email,
        courseId,
      });
      if (response.data.success) {
        message.success("Course rejected successfully!");
        setCourses((prev) => prev.filter((course) => course._id !== courseId));
      } else {
        message.error("Failed to reject course.");
      }
    } catch (error) {
      message.error("Something went wrong while rejecting the course.");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Trainer Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleApprove(record.email, record._id)}
          >
            Approve
          </Button>
          <Button
            type="danger"
            onClick={() => handleReject(record.email, record._id)}
          >
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
          Course Approval
        </h2>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey={(record) => record._id}
          loading={loading}
        />
      </Content>
    </Layout>
  );
};

export default CourseApproval;
