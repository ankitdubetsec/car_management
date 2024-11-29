import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Image,
  Tag,
  Space,
  message,
  Popconfirm,
  Input,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State to store product details
  const [editing, setEditing] = useState(false); // State to toggle edit mode
  const [form] = Form.useForm(); // Form instance

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

  useEffect(() => {
    // Fetch product data from the API
    const fetchProductDetails = async () => {
      try {
        const userToken = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get(
          `http://localhost:5000/api/v1/cars/${id}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProduct(response.data.car); // Set the fetched product data
        form.setFieldsValue(response.data.car); // Pre-fill the form with current product values
      } catch (error) {
        console.error("Error fetching product details", error);
        message.error("Product not found.");
        navigate("/products"); // Redirect to the product list page if error occurs
      }
    };

    fetchProductDetails();
  }, [id, navigate, form]);

  if (!product) return null; // Wait until product data is fetched

  const handleEdit = () => {
    setEditing(true); // Toggle to edit mode
  };

  const handleCancelEdit = () => {
    setEditing(false); // Cancel edit mode
    form.resetFields(); // Reset the form fields
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Get the form values
      const userToken = localStorage.getItem("token"); // Get token from localStorage

      // Send updated product data to the API
      const response = await axios.patch(
        `http://localhost:5000/api/v1/cars/${id}`,
        values,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Product updated successfully.");
      setProduct(response.data.car); // Update product state with the new data
      setEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating product", error);
      message.error("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    try {
      const userToken = localStorage.getItem("token"); // Get token from localStorage
      await axios.delete(`http://localhost:5000/api/v1/cars/${id}`, {
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Product deleted successfully.");
      navigate("/products"); // Redirect to the product list after deletion
    } catch (error) {
      message.error("Error deleting product.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/products")} // Navigate back to the product list page
        style={{ marginBottom: "20px" }}
      >
        Back to Products
      </Button>
      <Card
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        }}
      >
        {editing ? (
          // Render the edit form if editing is true
          <Form form={form} layout="vertical">
            <Title level={2}>Edit {product.title}</Title>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter the product title!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter the product description!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="tags"
              label="Tags"
              rules={[
                { required: true, message: "Please enter product tags!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Space>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </Space>
          </Form>
        ) : (
          <>
            <Title level={2}>{product.title}</Title>
            {/* Render all images */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={product.title}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
            <Paragraph>{product.description}</Paragraph>
            <div>
              <Space>
                {product.tags?.map((tag, index) => (
                  <Tag color="blue" key={index}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
            {userRole !== "viewer" && (
              <Space style={{ marginTop: "20px" }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this product?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ProductDetailPage;
