import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const thumbnailURL = course.Thumbnail.startsWith('/media') ? `http://localhost:8000${course.Thumbnail}` : 'https://via.placeholder.com/300';
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition rounded-xl overflow-hidden">
      {thumbnailURL && (
        <img
          src={thumbnailURL}
          alt="Course Thumbnail"
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-blue-600">{course.Coursename}</CardTitle>
        <CardDescription className="mt-1">
          {course.Details?.slice(0, 100)}...
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm text-gray-600">
        <p><strong>Educator: </strong>{course.EducatorName}</p>
        <p><strong>Level: </strong>{course.level}</p>
        <p><strong>Price: </strong>₹{course.Coursefee}</p>
      </CardContent>

      <CardFooter>
        <Button onClick={() => navigate(`/courses/${course.id}`)}>
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
}
