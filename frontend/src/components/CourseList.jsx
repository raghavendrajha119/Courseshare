import { useEffect, useState } from "react";
import { fetchFeaturedCourses } from "../utils/get_courses";
import FeatureCard from "../components/FeatureCard";
import CourseCard from "../components/CourseCard";
import { Button } from "./ui/button";

export default function CourseList() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    (async () => {
      const data = await fetchFeaturedCourses();
      setFeaturedCourses(data);
    })();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 6);
  };
  const visibleCourses = featuredCourses.slice(0, visibleCount);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon="📚" title="Diverse Courses" description="Explore content from experts across domains." />
          <FeatureCard icon="🧑‍🏫" title="Easy to Teach" description="Educators can build and launch courses quickly." />
          <FeatureCard icon="🌍" title="Global Learning" description="Learn from anywhere, anytime, at your pace." />
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="bg-white py-16 px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-10">
            🌟 Featured Courses
          </h2>
          <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {visibleCount < featuredCourses.length && (
            <div className="mt-10 text-center">
              <Button onClick={handleSeeMore} className="px-6 py-2 text-md">
                See More
              </Button>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
