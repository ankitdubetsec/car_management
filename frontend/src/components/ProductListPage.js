import React, { useState, useEffect } from "react";
import { Input, Card, Col, Row, Typography, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;

const ProductListPage = () => {
  const [cars, setCars] = useState([]); // List of cars
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate(); // For navigation to detail page

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const userToken = localStorage.getItem("token");
        const response = await axios.get(
          "https://car-management-1-w5ka.onrender.com/api/v1/cars",
          {
            headers: {
              authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCars(response.data.cars);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const viewDetails = (id) => {
    navigate(`/product/${id}`); // Navigate to the detail page with the car ID
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Your Cars
      </Title>
      <Search
        placeholder="Search by car name or brand"
        value={searchQuery}
        onChange={onSearchChange}
        style={{
          marginBottom: "20px",
          width: "100%",
          maxWidth: "500px",
        }}
      />
      <Button
        type="primary"
        size="large"
        style={{
          width: "100%",
          maxWidth: "300px",
          marginBottom: "20px",
          backgroundColor: "#1890ff",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        <Link
          to="/createProduct"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Add New Car
        </Link>
      </Button>
      <Row gutter={[24, 24]} justify="start" style={{ width: "100%" }}>
        {filteredCars.map((car) => (
          <Col xs={24} sm={12} md={8} lg={6} key={car.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={car.name}
                  src={car.images[0]}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              }
              title={car.title}
              extra={
                <span style={{ fontSize: "14px", color: "#888" }}>
                  {car.year}
                </span>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                marginBottom: "24px",
              }}
              bodyStyle={{
                padding: "16px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              onClick={() => viewDetails(car._id)} // Navigate to details on click
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {car.title}
                </p>
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  {car.description.slice(0, 100)}...
                </p>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => viewDetails(car._id)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductListPage;
