import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
const Signup: React.FC = () => {
  return <div className="max-w-screen-xl mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">Create your account</h1>
          <p className="text-gray-600 mb-6">
            Sign up to calculate your TDEE, get personalized nutrition
            recommendations, and track your progress.
          </p>
          <SignupForm />
          <p className="text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-[#7aa59b] hover:underline transition-colors duration-200">
              Log in
            </Link>
          </p>
        </div>
        <div className="hidden md:block flex-1 bg-[#3C5C54] rounded-lg overflow-hidden">
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">
                Benefits of Creating an Account
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    ✓
                  </span>
                  <span>Save your TDEE calculations</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    ✓
                  </span>
                  <span>Get personalized macro recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    ✓
                  </span>
                  <span>Update your information as your body changes</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    ✓
                  </span>
                  <span>Track your nutrition journey over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Signup;