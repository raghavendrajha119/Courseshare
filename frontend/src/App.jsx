import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CourseDetailPage from "./pages/CourseDetailPage";
import EnrollSuccess from "./components/EnrollStatus/EnrollSuccess";
import Footer from "./components/Footer";
import ChangePassword from "./components/Account/ChangePassword";
import ProfileDetails from "./components/Account/AccountDetails";
import UpdateProfile from "./pages/UpdateProfilePage"
import AddCourse from "./components/CourseDetail/AddCourse";
import MyCourses from "./components/CourseDetail/MyCourses";
import UpdateCourse from "./components/CourseDetail/UpdateCourse";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/enroll/:courseId" element={<EnrollSuccess />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/account" element={<ProfileDetails/>} />
          <Route path="/update-profile" element={<UpdateProfile/>} />
          <Route path="/add-course" element={<AddCourse/>}/>
          <Route path="/update-course/:id" element={<UpdateCourse/>} />
          <Route path="/my-courses" element={<MyCourses/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;