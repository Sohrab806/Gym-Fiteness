import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ViewPage from "./ViewPage";
import PlanedWorkout from "./PlanedWorkout";
import UserWorkout from "./Userworkout";
import UsersPage from "./Allusers";

const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("viewpage");
  const [menuItems, setMenuItems] = useState([]); // Dynamic menu items
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    setMenuItems([]); // Reset menu items
    message.success("You have successfully logged out.");
    navigate("/"); // Redirect to the login page
  };

  const initializeMenuItems = (usertype) => {
    const baseItems = [
      getItem("Home", "viewpage", <HomeOutlined />),
      getItem("Workouts", "workout", <PieChartOutlined />),
      getItem("Users", "sub1", <UserOutlined />, [
        getItem("workout", "userworkout"),
        getItem("Bill", "users/bill"),
        getItem("Alex", "users/alex"),
      ]),
      getItem("Settings", "sub2", <SettingOutlined />, [
        getItem("Profile", "settings/profile"),
        getItem("Preferences", "settings/preferences"),
      ]),
      getItem("Files", "files", <FileOutlined />),
      getItem("About", "about", <InfoCircleOutlined />),
    ];

    if (usertype === "admin") {
      baseItems.unshift(
        getItem("Dashboard", "dashboard", <DesktopOutlined />, [
          getItem("Users", "users"),
          getItem("Preferences", "dashboard/preferences"),
        ])
      );
    }
    return baseItems;
  };

  // Effect to verify token and initialize menu items
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("You are not authenticated. Redirecting to login...");
      navigate("/"); // Redirect to login page
    } else {
      const verifyToken = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            const email = response.data.user.email;
            const usertype = response.data.user.usertype;
            localStorage.setItem("email", email); // Store email in localStorage
            localStorage.setItem("usertype", usertype); // Store user type in localStorage
            setMenuItems(initializeMenuItems(usertype)); // Dynamically set menu items
            message.success("Token verified successfully!");
          }
        } catch (err) {
          console.error(
            "Token verification failed:",
            err.response || err.message
          );
          message.error("Invalid token. Redirecting to login...");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/");
        }
      };

      verifyToken();
    }
  }, [navigate]);

  const handleMenuClick = ({ key }) => {
    setActiveItem(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "#2E8B57",
        }}
      >
        <div
          style={{
            height: 64,
            color: "black",
            textAlign: "center",
            fontSize: collapsed ? "16px" : "20px",
            lineHeight: "64px",
            background: "rgba(255, 255, 255, 0.2)",
            fontWeight: "bold",
          }}
        >
          GYM & FITNESS
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeItem]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: "#2E8B57",
            color: "white",
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Welcome to the Dashboard</span>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ flex: 1, margin: 0 }}>
        <Breadcrumb
  style={{
    margin: "6px 6px",
  }}
  items={[{ title: "Home" }, { title: activeItem }]}
/>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 160px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {activeItem === "viewpage" && <ViewPage />}
            {activeItem === "workout" && <PlanedWorkout />}
            {activeItem === "userworkout" && <UserWorkout />}
            {activeItem === "users" && <UsersPage/>}
          </div>
        </Content>
        <Footer
          style={{
            height: 40,
            textAlign: "center",
            background: "#2E8B57",
            color: "white",
          }}
        >
          ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/viewpage" element={<ViewPage />} />
      <Route path="/workout" element={<PlanedWorkout />} />
      <Route path="/userworkout" element={<UserWorkout />} />
      <Route path="/users" element={<UsersPage/>} />
    </Routes>
  );
};

export default App;
