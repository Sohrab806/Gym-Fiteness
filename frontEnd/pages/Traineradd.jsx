import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const GymTrainerForm = () => {
  const [form] = Form.useForm();
  const [trainerImage, setTrainerImage] = useState(null);

  // Handle profile image upload
  const handleImageUpload = (file) => {
    setTrainerImage(file);
    return false; // Prevent auto-upload
  };

  // Handle form submission
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name); // Trainer's name
    formData.append("specialty", values.specialty); // Trainer's specialty
    formData.append("experience", values.experience); // Years of experience
    formData.append("contact", values.contact); // Trainer's contact info
    if (trainerImage) {
      formData.append("image", trainerImage); // Attach the profile image file
    }

    try {
      const response = await axios.post("http://localhost:5000/api/trainers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Trainer added successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      message.error("Failed to add trainer.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h2>Add Gym Trainer</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Trainer Name */}
        <Form.Item
          label="Trainer Name"
          name="name"
          rules={[{ required: true, message: "Please enter the trainer's name!" }]}
        >
          <Input placeholder="Enter trainer's name" />
        </Form.Item>

        {/* Trainer Specialty */}
        <Form.Item
          label="Specialty"
          name="specialty"
          rules={[{ required: true, message: "Please enter the trainer's specialty!" }]}
        >
          <Input placeholder="Enter trainer's specialty" />
        </Form.Item>

        {/* Trainer Experience */}
        <Form.Item
          label="Years of Experience"
          name="experience"
          rules={[{ required: true, message: "Please enter the trainer's experience!" }]}
        >
          <Input placeholder="Enter years of experience" />
        </Form.Item>

        {/* Trainer Contact */}
        <Form.Item
          label="Contact Info"
          name="contact"
          rules={[{ required: true, message: "Please enter the trainer's contact information!" }]}
        >
          <Input placeholder="Enter contact info" />
        </Form.Item>

        {/* Profile Image Upload */}
        <Form.Item label="Upload Profile Image">
          <Upload
            beforeUpload={handleImageUpload}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {trainerImage && <p>Selected File: {trainerImage.name}</p>}
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Trainer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GymTrainerForm;
