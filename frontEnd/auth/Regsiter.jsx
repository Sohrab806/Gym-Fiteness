import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { message, Button, Form, Input, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";

// Custom validation to check if passwords match
const validateConfirmPassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("The two passwords that you entered do not match!")
    );
  },
});

const Register = () => {
  const navigate = useNavigate(); // Use the hook to get the navigate function

  const onFinish = async (values) => {
    try {
      // Replace this URL with your actual endpoint
      const { email, password, name } = values; // Only send the password
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        password,
        email,
      });
      message.success("Registration successful!");
      console.log("Response:", response.data);
      navigate('/'); // Navigate to the home or login page
    } catch (error) {
      message.error("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row justify="center" style={{ minHeight: "100vh", alignItems: "center" }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card
          title="Create an Account"
          bordered={false}
          style={{ padding: "30px" }}
        >
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
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email address!" },
              ]}
            >
              <Input placeholder="Enter your Email" />
            </Form.Item>

            <Form.Item
              label="Username"
              name="name"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input placeholder="Enter your username" />
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

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                validateConfirmPassword,
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
            <Row justify="center">
              <Col>
                <Link to="/" style={{ fontSize: "16px" }}>
                  Already have an account? Login here.
                </Link>
              </Col>
            </Row>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
