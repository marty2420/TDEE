import React from 'react';
import { Link } from 'react-router-dom';
import { ActivityIcon, CalculatorIcon, SaveIcon, UserIcon } from 'lucide-react';
const Home: React.FC = () => {
  return <div className="max-w-6xl mx-auto">
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Calculate Your Daily Energy Needs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our TDEE calculator helps you determine your Total Daily Energy
            Expenditure and provides personalized nutrition recommendations
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg">
              Get Started
            </Link>
            <Link to="/login" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-md font-medium text-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalculatorIcon size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calculate TDEE</h3>
            <p className="text-gray-600">
              Our advanced calculator uses the Mifflin-St Jeor equation to
              determine your daily caloric needs with precision.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Goals</h3>
            <p className="text-gray-600">
              Whether you want to lose weight, maintain, or gain muscle, we'll
              adjust your caloric and macro targets accordingly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SaveIcon size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Save Your Data</h3>
            <p className="text-gray-600">
              Create an account to save your calculations, track your progress,
              and update your information as needed.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50 rounded-lg px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-600">
            Simple steps to calculate your personalized nutrition plan
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Create an Account</h3>
              <p className="text-gray-600">
                Sign up to save your calculations and track your progress over
                time.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Enter Your Details</h3>
              <p className="text-gray-600">
                Provide your age, gender, weight, height, and activity level for
                accurate calculations.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <span className="text-blue-600 font-bold text-lg">3</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Select Your Goal</h3>
              <p className="text-gray-600">
                Choose whether you want to lose weight, maintain, or gain muscle
                mass.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">
                Get Your Personalized Plan
              </h3>
              <p className="text-gray-600">
                Receive your TDEE calculation and recommended macronutrient
                breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;