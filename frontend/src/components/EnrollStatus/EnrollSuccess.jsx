import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function EnrollSuccess() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  useEffect(() => {
    const enrollUser = async () => {
      const token = localStorage.getItem("access_token");
        if(success==="true") {
            try {
                await axios.post(
                `http://localhost:8000/courseshare/enroll/${courseId}/`,
                {},
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
                );
                console.log("Enrollment successful!");
            } catch (error) {
                console.error("Enrollment failed:", error.response?.data || error.message);
            }
        }  
    };

    enrollUser();
  }, [courseId]);
  return (
    <div className="max-w-3xl mx-auto text-center py-20 px-4">
      {success === "true" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="mt-4 text-gray-700">
            You have successfully enrolled in the course. You can now access the content.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600">Payment Canceled</h1>
          <p className="mt-4 text-gray-700">
            Your payment was canceled. You can try enrolling again later.
          </p>
        </>
      )}
    </div>
  );
}
