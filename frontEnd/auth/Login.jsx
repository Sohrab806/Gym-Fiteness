import React from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { message, Button, Form, Input, Row, Col, Card } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    // Use the navigate hook

    try {
      // Send login request
      const { email, password } = values; // Only send email and password
      const response = await axios.post("http://localhost:5000/api/login", {
        email, // Corrected to send email instead of name
        password,
      });

      // If login is successful, store the JWT token
      const { token } = response.data;
      localStorage.setItem("token", token); // Save the token in localStorage

      message.success("Login successful!");
      console.log("Response:", response.data);
     

      // Redirect to the homepage
      navigate("/home"); // Redirect to home page after successful login
    } catch (error) {
      message.error("Invalid credentials. Please try again.");
      console.error("Error:", error);
    }
    console.log("Success:", values.email);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row justify="center" style={{ minHeight: "100vh", alignItems: "center" }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card title="Log in Here"  bordered={false} style={{ padding: "30px" }} >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "The input is not a valid email!" },
              ]}
            >
              <Input placeholder="Enter your Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long!",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Row justify="center">
              <Col>
                <Link to="/register" style={{ fontSize: "16px" }}>
                  Don't have an account? Register here.
                </Link>
              </Col>
            </Row>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
