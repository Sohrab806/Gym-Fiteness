import React, { useState } from "react";
import { Layout, Form, Input, Button, message, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory
import axios from "axios";

const { Content } = Layout;
const { Option } = Select;

const TrainerApplication = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const email = localStorage.getItem("email");
    try {
      setLoading(true);
      const {  name,
        phone,
        dob,
        certifications,
        experience,
        trainingAreas,
        startDate,
        coverLetter, } = values;
      const response = await axios.post("http://localhost:5000/api/trainers/apply", {  name,
        email,
        phone,
        dob,
        certifications,
        experience,
        trainingAreas,
        startDate,
        coverLetter,
        
     } );
      if (response.data.success) {
        message.success("Application submitted successfully!");
        form.resetFields();
        navigate("/home"); // Redirect after success using navigate
      } else {
        message.error("Failed to submit application. Please try again.");
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Content
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "24px",
          background: "#fff",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: "700", color: "#333" }}>
          Apply for Trainer Position
        </h2>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone number!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Please select your date of birth!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Certifications"
            name="certifications"
            rules={[{ required: true, message: "Please enter your certifications!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true, message: "Please describe your experience!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Preferred Training Areas"
            name="trainingAreas"
            rules={[{ required: true, message: "Please select your preferred training areas!" }]}
          >
            <Select mode="multiple" placeholder="Select training areas">
              <Option value="cardio">Cardio</Option>
              <Option value="strength">Strength Training</Option>
              <Option value="yoga">Yoga</Option>
              <Option value="pilates">Pilates</Option>
              <Option value="nutrition">Nutrition</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Available Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please select your available start date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Cover Letter"
            name="coverLetter"
            rules={[{ required: true, message: "Please write a cover letter!" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default TrainerApplication;
