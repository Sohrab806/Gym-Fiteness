import React, { useState } from "react";
import { Form, Input, Button, Upload, Select, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const ExerciseForm = () => {
  const [form] = Form.useForm();
  const [exerciseTypes, setExerciseTypes] = useState([
    { name: "", description: "" }, // Updated to match backend schema
  ]); 
  const [categoryImage, setCategoryImage] = useState(null); 

  // Predefined categories
  const categories = [
    { id: "chest", name: "Chest Day" },
    { id: "legs", name: "Leg Day" },
    { id: "back", name: "Back Day" },
    { id: "shoulders", name: "Shoulders Day" },
    { id: "arms", name: "Arms Day" },
    { id: "fullbody", name: "Full Body" },
    { id: "cardio", name: "Cardio" },
  ];

  // Add new exercise type
  const addExerciseType = () => {
    setExerciseTypes([...exerciseTypes, { name: "", description: "" }]);
  };

  // Remove exercise type
  const removeExerciseType = (index) => {
    const updatedTypes = [...exerciseTypes];
    updatedTypes.splice(index, 1);
    setExerciseTypes(updatedTypes);
  };

  // Update exercise type
  const updateExerciseType = (index, field, value) => {
    const updatedTypes = [...exerciseTypes];
    updatedTypes[index][field] = value;
    setExerciseTypes(updatedTypes);
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    setCategoryImage(file);
    return false; 
  };

  // Handle form submission
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("category", values.category); 
    formData.append("description", values.categoryDescription); 
    formData.append("exercise", JSON.stringify(exerciseTypes)); 
    if (categoryImage) {
      formData.append("image", categoryImage); 
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/category",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      message.success("Category and exercises submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      message.error("Failed to submit category and exercises.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <h2>Add Category with Exercise Types</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Category Name"
          name="category"
          rules={[{ required: true, message: "Please enter the category name!" }]}
        >
          <Select placeholder="Select a category" allowClear>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Category Description"
          name="categoryDescription"
          rules={[{ required: true, message: "Please enter the category description!" }]}
        >
          <Input.TextArea placeholder="Enter category description" rows={3} />
        </Form.Item>

        <Form.Item label="Upload Category Image">
          <Upload
            beforeUpload={handleImageUpload}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {categoryImage && <p>Selected File: {categoryImage.name}</p>}
        </Form.Item>

        <Form.Item label="Exercise Types">
          {exerciseTypes.map((exercise, index) => (
            <div
              key={index}
              style={{
                marginBottom: 24,
                border: "1px solid #d9d9d9",
                padding: 16,
                borderRadius: 4,
              }}
            >
              <Input
                placeholder={`Exercise Name ${index + 1}`}
                value={exercise.name} 
                onChange={(e) => updateExerciseType(index, "name", e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <Input.TextArea
                placeholder={`Exercise Description ${index + 1}`}
                value={exercise.description} 
                onChange={(e) =>
                  updateExerciseType(index, "description", e.target.value)
                }
                rows={2}
                style={{ marginBottom: 8 }}
              />
              <Button
                type="link"
                danger
                onClick={() => removeExerciseType(index)}
                disabled={exerciseTypes.length === 1}
              >
                Remove Exercise
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={addExerciseType}
            block
            icon={<PlusOutlined />}
          >
            Add Exercise
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Category and Exercise Types
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExerciseForm;
