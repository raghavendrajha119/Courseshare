import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserEnrollments, startCheckout } from "@/utils/get_enrollments";

export default function CourseEnrollButton({ courseId, status }) {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (status === "not enrolled") {
      navigate(`/checkout/${courseId}`);
    }
  };

  return status==="enrolled" ? (
    <Button className="w-full mt-6 bg-green-900 hover:bg-green-700 text-white" disabled>
      You are already enrolled 🎉
    </Button>
  ) : (
    <Button className="w-full mt-6" onClick={handleEnroll}>
      Enroll Now
    </Button>
  );
}
