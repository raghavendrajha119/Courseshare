import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMyCourses } from "@/utils/get_mycourse";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getMyCourses();
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {courses.map((course) => {
        const thumbnailURL = course.Thumbnail?.startsWith("/media")
          ? `http://localhost:8000${course.Thumbnail}`
          : course.Thumbnail || "https://via.placeholder.com/150";

        return (
          <Card
            key={course.id}
            className="flex items-center gap-6 p-2 rounded-2xl shadow-md"
          >
            <img
              src={thumbnailURL}
              alt="Thumbnail"
              className="w-30 h-20 object-cover border"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{course.Coursename}</h3>
              <p className="text-muted-foreground">{course.Institutename}</p>
              <div className="text-sm text-gray-600 mt-1 space-x-4">
                <span><strong>Fee: </strong> ₹{course.Coursefee}</span>
                <span><strong>Level: </strong> {course.level}</span>
                <span><strong>Category: </strong> {course.category}</span>
              </div>
            </div>
            <Link to={`/update-course/${course.id}`}>
              <Button variant="default">Update Details</Button>
            </Link>
          </Card>
        );
      })}

      <div className="flex justify-center pt-6">
        <Link to="/add-course">
          <Button variant="default" className="text-lg px-6 py-2">
            ➕ Add Course
          </Button>
        </Link>
      </div>
    </div>
  );
}
