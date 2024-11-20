import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  CarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Error from "./components/Error";
import ProductListPage from "./components/ProductListPage";
import ProductCreationPage from "./components/ProductCreationPage";
import ProductDetailPage from "./components/ProductDetailPage";

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="App">
        {/* Navbar */}
        <Header style={{ padding: 0 }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CarOutlined />}>
              <Link to="/products">Cars</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<AppstoreAddOutlined />}>
              <Link to="/createProduct">Create Product</Link>
            </Menu.Item>
          </Menu>
        </Header>

        {/* Page content */}
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/createProduct" element={<ProductCreationPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
