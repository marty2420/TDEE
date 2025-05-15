import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TdeeCalculator from '../components/calculator/TdeeCalculator';
const Dashboard: React.FC = () => {
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>;
  }
  if (!user) {
    return null; // Will redirect in useEffect
  }


  return <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">    
              <div className="bg-blue-100 p-3 rounded-full">
                <UserIcon size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md">
                <SettingsIcon size={18} />
                <span>Account Settings</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <p className="text-gray-600 text-sm mb-4">
              Track your nutrition journey and body composition changes over
              time.
            </p>
<div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
  <p><strong>Age:</strong> {user.input?.age} yrs</p>
  <p><strong>Gender:</strong> {user.input?.gender}</p>
  <p><strong>Weight:</strong> {user.input?.weight} kg</p>
  <p><strong>Height:</strong> {user.input?.height} cm</p>
  <p><strong>Activity Level:</strong> {user.input?.activityLevel}</p>
  <p><strong>Goal:</strong> {user.input?.goal}</p>
  <p><strong>BMR:</strong> {user.tdeeResults?.bmr} kcal</p>
  <p><strong>TDEE:</strong> {user.tdeeResults?.tdee} kcal</p>
  <p><strong>Target Calories:</strong> {user.tdeeResults?.targetCalories} kcal</p>
  <p><strong>Protein:</strong> {user.tdeeResults?.protein} g</p>
  <p><strong>Carbs:</strong> {user.tdeeResults?.carbs} g</p>
  <p><strong>Fat:</strong> {user.tdeeResults?.fat} g</p>
</div>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <p className="text-sm text-blue-700">
                This feature is coming soon! You'll be able to log your weight,
                measurements, and see your progress over time.
              </p>
            </div>
          </div>
          
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-6">Your TDEE Calculator</h1>
          <TdeeCalculator />
        </div>
      </div>
    </div>;
};
export default Dashboard;