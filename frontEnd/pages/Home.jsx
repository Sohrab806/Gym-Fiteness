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
import ExerciseForm from "./Setexcercise";
import TrainerApplication from "./Trainerapplication";
import TrainerApplications from "./Applications";
import TrainerListForm from "./Alltrainers";
import TrainerCreateCourse from "./Addcourse";
import CourseApproval from "./Courseapproval";
import ApprovedCourses from "./Allcourse";


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

  const initializeMenuItems = (usertype,trainer) => {
    const baseItems = [
      getItem("Home", "viewpage", <HomeOutlined />),
      getItem("Workouts", "workout", <PieChartOutlined />),
      getItem("Users", "sub1", <UserOutlined />, [
        getItem("workout", "userworkout"),
        getItem("Apply", "trainerform"),
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
          getItem("Users", "users",<UserOutlined />),
          getItem("AddExercise", "addexercise",),
          getItem("Application", "apply",),
          getItem("Trainers", "trainer",),
          getItem("CourseApplications", "courseapp",),
          getItem("Courses", "allcourse",),
        ])
      );
    }
    if(trainer =="yes"){

  const trainerdash=getItem("Trainer Dashboard", "trainerDashboard", <TeamOutlined />,[
       getItem("Mycourses", "mycourse",),
       getItem("Addcourses", "courses",),
       getItem("Application", "",),

  ]);

  baseItems.splice(2, 0, trainerdash);
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
            const trainer = response.data.user.trainer;
           
            localStorage.setItem("email", email); // Store email in localStorage
            localStorage.setItem("usertype", usertype); // Store user type in localStorage
            localStorage.setItem("trainer", trainer); // Store user type in localStorage
            setMenuItems(initializeMenuItems(usertype,trainer)); // Dynamically set menu items
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
            {activeItem === "addexercise" && <ExerciseForm/>}
            {activeItem === "trainerform" && <TrainerApplication/>}
            {activeItem === "apply" && <TrainerApplications/>}
            {activeItem === "trainer" && <TrainerListForm/>}
            {activeItem === "courses" && <TrainerCreateCourse/>}
            {activeItem === "courseapp" && <CourseApproval/>}
            {activeItem === "allcourse" && <ApprovedCourses/>}
            
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
      <Route path="/setexcercise" element={<ExerciseForm/>} />
      <Route path="/trainerform" element={<TrainerApplication/>} />
      <Route path="/apply" element={<TrainerApplications/>} />
      <Route path="/trainer" element={<TrainerListForm/>} />
      <Route path="/courses" element={<TrainerCreateCourse/>} />
   
    </Routes>
  );
};

export default App;
