import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Select, message, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";  

const { TextArea } = Input;
const { Option } = Select;

const TrainerCreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  
  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      const trainerEmail = localStorage.getItem("email"); // Retrieve trainer's email
      if (!trainerEmail) {
        message.error("Trainer email not found. Please log in again.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/courses/create", {
        ...values,
        trainerEmail, // Attach trainer email to the payload
      });

      if (response.data.success) {
        message.success("Course created successfully. Awaiting approval.");
        navigate("/home"); 
      } else {
        message.error("Failed to create the course.");
      }
    } catch (error) {
      message.error("An error occurred while creating the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title="Create New Course"
        style={{
          maxWidth: "600px",
          margin: "auto",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Course Title"
            name="title"
            rules={[{ required: true, message: "Please enter the course title" }]}
          >
            <Input placeholder="Enter course title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter the course description" }]}
          >
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>

          <Form.Item
            label="Duration (hours)"
            name="duration"
            rules={[{ required: true, message: "Please enter the course duration" }]}
          >
            <InputNumber min={1} placeholder="Enter course duration in hours" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the course price" }]}
          >
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Enter course price"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select course category">
              <Option value="Fitness">Fitness</Option>
              <Option value="Nutrition">Nutrition</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="Martial Arts">Martial Arts</Option>
              <Option value="Strength Training">Strength Training</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Course
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TrainerCreateCourse;
