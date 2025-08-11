import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { startCheckout } from "@/utils/get_enrollments";
import { toast } from "sonner";

export default function CourseEnrollButton({ courseId, status }) {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please log in to enroll in the course.");
      return;
    }

    try {
      setLoading(true);
      const data = await startCheckout(courseId, token);

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error("Failed to get payment URL.");
      }
    } catch (error) {
      const message =
        error?.response?.status === 401
          ? "Your session expired. Please log in again."
          : "Something went wrong during checkout.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return status === "enrolled" ? (
    <Button
      className="w-full mt-6 bg-green-900 hover:bg-green-700 text-white"
      disabled
    >
      You are already enrolled 🎉
    </Button>
  ) : (
    <Button
      className="w-full mt-6 bg-purple-600 hover:bg-purple-800 text-white"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? "Processing..." : "Enroll Now"}
    </Button>
  );
}
