import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import CourseList from "@/components/CourseList";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black dark:bg-zinc-900 dark:text-white ">
      {/* Hero Section */}
      <section className="bg-white py-20 px-6 text-center shadow-sm">
      <h1 className="text-5xl font-bold text-gray-900">
        Welcome to{" "}
        <span className="text-blue-600">
          <TypeAnimation
            sequence={[
              "CourseShare", 2000,
              "Learn", 2000,
              "Teach", 2000,
              "Empower", 2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </span>
      </h1>
        <p className="mt-4 text-xl text-gray-600">
          Learn. Teach. Empower.
        </p>

        {!isLoggedIn && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-medium"
            >
              Register
            </button>
          </div>
        )}
        {isLoggedIn && (
          <p className="mt-6 text-green-600 font-medium text-lg">You're logged in 🎉</p>
        )}
      </section>

      <CourseList/>
    </div>
  );
}
