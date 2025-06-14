import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="bg-[#FFFCF0] min-h-screen">
      {" "}
      {/* Apply the page background color here */}
      <div className="max-w-screen-xl mx-auto py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
            <p className="text-gray-600 mb-6">
              Log in to your account to access your personal TDEE calculations
              and nutrition recommendations.
            </p>
            <LoginForm />
            <p className="text-center mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:underline transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="hidden md:block flex-1 bg-[#3C5C54] rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Track Your Nutrition Journey
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      ✓
                    </span>
                    <span>Calculate your personalized TDEE</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      ✓
                    </span>
                    <span>Get macro recommendations for your goals</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      ✓
                    </span>
                    <span>Save and update your calculations</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      ✓
                    </span>
                    <span>Track your progress over time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
