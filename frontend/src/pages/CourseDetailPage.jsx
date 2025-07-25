import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSelectCourse } from "@/utils/get_courses";
import CourseHeader from "@/components/CourseDetail/CourseHeader";
import CourseInfo from "@/components/CourseDetail/CourseInfo";
import CoursePreview from "@/components/CourseDetail/CoursePreview";
import CourseAccordion from "@/components/CourseDetail/CourseAccordion";
import CourseEnrollButton from "@/components/CourseDetail/CourseEnrollButton";
import CourseVideos from "@/components/CourseDetail/CourseVideos";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  let thumbnailURL = 'https://via.placeholder.com/300';
  if (course?.Thumbnail) {
    thumbnailURL = course.Thumbnail.startsWith('/media')
      ? `http://localhost:8000${course.Thumbnail}`
      : course.Thumbnail;
  }
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSelectCourse(id);
        setCourse(data);
      } catch (err) {
        console.error("Course fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <Skeleton className="w-full h-96 rounded-md" />;
  }

  if (!course) return <p className="text-center text-red-600">Course not found.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <CourseHeader title={course.Coursename} category={course.category} />
      <CoursePreview thumbnail={thumbnailURL} />
      <CourseInfo
        instructor={course.EducatorName}
        level={course.level}
        duration={course.Duration}
        language={course.Language}
        price={course.Coursefee}
      />
      <p className="text-gray-700 mt-4">{course.Details}</p>
      <CourseAccordion syllabus={course.syllabus || []} />
      <CourseEnrollButton courseId={course.id} status={course.status} />
      <CourseVideos videos={course.videos || []} status={course.status} />
    </div>
  );
}
