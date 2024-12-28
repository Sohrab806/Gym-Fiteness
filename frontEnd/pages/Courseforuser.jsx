import React, { useState, useEffect } from "react";
import { Layout, Card, Button, message, Spin, Row, Col } from "antd";
import axios from "axios";

const { Content } = Layout;

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/courses/approved`);
        if (response.data.success) {
          setCourses(response.data.data);
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

  const handleAddCourse = async (courseId) => {
    try {
      setAdding(true);
      const userEmail = localStorage.getItem("email"); // Assumes user's email is stored in localStorage
      const response = await axios.post(`${BASE_URL}/api/courses/add`, {
        courseId,
        userEmail,
      });
      if (response.data.success) {
        message.success("Course added successfully!");
      } else {
        message.error("Failed to add course.");
      }
    } catch (error) {
      message.error("Something went wrong while adding the course.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Content
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          
          background: "transparent", // Make background transparent
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflow: "visible", // Ensure content is not clipped
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "700",
            color: "#333",
          }}
        >
          Available Courses
        </h2>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Row gutter={[24, 24]}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={course.title}
                    bordered
                    bodyStyle={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      width: "100%", // Adjust card width
                    }}
                  >
                    <p>
                      <strong>Trainer:</strong> {course.trainerEmail}
                    </p>
                    <p>
                      <strong>Category:</strong> {course.category}
                    </p>
                    <p>
                      <strong>Duration:</strong> {course.duration} hours
                    </p>
                    <p>
                      <strong>Price:</strong> ${course.price}
                    </p>
                    <Button
                      type="primary"
                      loading={adding}
                      onClick={() => handleAddCourse(course._id)}
                      block
                    >
                      Add Course
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ textAlign: "center", width: "100%" }}>
                No courses available at the moment.
              </p>
            )}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default AllCourses;
