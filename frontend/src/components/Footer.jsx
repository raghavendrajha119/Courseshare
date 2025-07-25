import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">CourseShare</h3>
          <p>Empowering learners with accessible and curated online courses.</p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/my-courses" className="hover:text-blue-600">My Courses</Link></li>
            <li><Link to="/enrollments" className="hover:text-blue-600">Enrollments</Link></li>
            <li><Link to="/account" className="hover:text-blue-600">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Support</h3>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t">
        © {new Date().getFullYear()} CourseShare. All rights reserved.
      </div>
    </footer>
  );
}
