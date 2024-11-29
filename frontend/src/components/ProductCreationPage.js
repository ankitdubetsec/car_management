import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;
const { Option } = Select;

const ProductCreationPage = () => {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);

  const [userRole, setUserRole] = useState("");

  // Decode user role from token
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        setUserRole(decodedToken.role); // Assuming the token contains the role
      } catch (error) {
        console.error("Failed to decode token", error);
        message.error("Invalid or expired token. Please log in again.");
      }
    } else {
      message.error("No token found. Please log in.");
    }
  }, []);

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 10) {
      message.error("You can upload a maximum of 10 images.");
      return;
    }
    setImages(fileList);
    form.setFieldValue("images", fileList); // Synchronize with the form
  };

  const onFinish = async (values) => {
    if (images.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file.originFileObj)); // Append multiple images
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("tags", JSON.stringify(values.tags)); // Convert tags array to string for backend processing

    try {
      const userToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/v1/cars",
        formData,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Car added successfully!");
      form.resetFields();
      setImages([]);
    } catch (error) {
      message.error(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  if (userRole === "viewer") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f7f7f7",
        }}
      >
        <h1>New car can only be added by managers and admin</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "60px",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={2} style={{ marginBottom: "30px", color: "#333" }}>
        Add New Car
      </Title>

      <Form
        form={form}
        onFinish={onFinish}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        }}
        initialValues={{ images: [] }}
      >
        {/* Image Upload */}
        <Form.Item
          name="images"
          label="Product Images"
          rules={[{ required: true, message: "Please upload product images!" }]}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            multiple
            onChange={handleImageChange}
            beforeUpload={() => false} // Prevent auto-upload
            fileList={images}
          >
            {images.length < 10 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#1890ff",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                <PlusOutlined />
                <div style={{ marginTop: "8px" }}>Upload</div>
              </div>
            )}
          </Upload>
          <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
            You can upload up to 10 images.
          </p>
        </Form.Item>

        {/* Product Title */}
        <Form.Item
          name="title"
          label="Product Title"
          rules={[{ required: true, message: "Please enter a product title!" }]}
        >
          <Input
            placeholder="Enter product title"
            style={{ padding: "12px", fontSize: "16px" }}
          />
        </Form.Item>

        {/* Product Description */}
        <Form.Item
          name="description"
          label="Product Description"
          rules={[
            { required: true, message: "Please enter a product description!" },
          ]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Enter product description"
            maxLength={500}
            style={{ padding: "12px", fontSize: "16px" }}
          />
        </Form.Item>

        {/* Product Tags */}
        <Form.Item
          name="tags"
          label="Product Tags"
          rules={[
            { required: true, message: "Please select at least one tag!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select tags (e.g., car_type, company, dealer)"
            style={{ width: "100%" }}
          >
            <Option value="car_type">Car Type</Option>
            <Option value="company">Company</Option>
            <Option value="dealer">Dealer</Option>
            <Option value="new">New</Option>
            <Option value="sale">Sale</Option>
            <Option value="luxury">Luxury</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Space style={{ width: "100%" }} direction="vertical" size="large">
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                fontSize: "16px",
                padding: "14px",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                fontWeight: "bold",
              }}
            >
              Create Product
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductCreationPage;
