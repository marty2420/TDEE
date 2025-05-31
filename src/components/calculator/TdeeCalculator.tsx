import React, { useState } from 'react';
import { useTdee } from '../../context/TdeeContext';  // <-- Import context hook
import { ArrowRightIcon } from 'lucide-react';
import { TdeeInputs, calculateTDEE, TdeeResults } from '../../utils/tdeeCalculator';
import ResultsDisplay from './ResultsDisplay';
import { useAuth } from '../../context/AuthContext';


const TdeeCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TdeeInputs>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [results, setResults] = useState<TdeeResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setIsUpdating } = useTdee();
  const { updateUser } = useAuth();  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) : value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setIsUpdating(true); // Start dashboard loading

  const MIN_LOADING_TIME = 2000; // 4 seconds minimum loading time
  const startTime = Date.now();

  try {
    const calculatedResults = await calculateTDEE(formData);
    setResults(calculatedResults);

    const userId = JSON.parse(localStorage.getItem('tdeeUser') || '{}').id;
    const token = localStorage.getItem('tdeeToken');

    if (!userId || !token) {
      console.error('User is not authenticated');
      setIsLoading(false);
      setIsUpdating(false);
      return;
    }

    // Save TDEE data to backend


   const response = await fetch(`/api/users/tdee`, {
  method: 'PUT',  // instead of PUT
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId,
    input: formData,
    tdeeResults: calculatedResults,
  }),
});


    if (!response.ok) {
      console.error('Failed to save TDEE data');
      setIsLoading(false);
      setIsUpdating(false);
      return;
    }

    // Fetch latest data from backend
    const latestDataRes = await fetch(`/api/users/tdee/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!latestDataRes.ok) {
      console.error('Failed to fetch latest TDEE data');
      setIsLoading(false);
      setIsUpdating(false);
      return;
    }

    const latestData = await latestDataRes.json();

    // Update localStorage with latest data
    const currentUser = JSON.parse(localStorage.getItem('tdeeUser') || '{}');
    const updatedUser = {
      ...currentUser,
      input: latestData.input,
      tdeeResults: latestData.tdeeResults,
    };

    localStorage.setItem('tdeeUser', JSON.stringify(updatedUser));
    updateUser(updatedUser);
    console.log('Updated user data saved locally and state updated:', updatedUser);

    
    const elapsed = Date.now() - startTime;
    const remainingTime = MIN_LOADING_TIME - elapsed;

    if (remainingTime > 0) {
      setTimeout(() => {
        setIsLoading(false);
        setIsUpdating(false);
      }, remainingTime);
    } else {
      setIsLoading(false);
      setIsUpdating(false);
    }
  } catch (err) {
    console.error('Error while saving/fetching:', err);
    setIsLoading(false);
    setIsUpdating(false);
  }
};


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Calculate Your TDEE</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Input Fields */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min={15}
                max={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min={30}
                max={300}
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min={100}
                max={250}
                step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise & physical job)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="goal">Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#4D6C5B] focus:outline-none focus:ring-2 focus:ring-[#4D6C5B] focus:ring-offset-2 flex items-center justify-center transition-colors duration-300"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Calculate</span>
                <ArrowRightIcon size={18} className="ml-2" />
              </>
            )}
          </button>

          {/* Show dashboard-wide updating message */}
          {isLoading && (
            <div className="text-center p-4 text-blue-700 font-semibold">
              Calculating your TDEE, please wait...
            </div>
          )}
        </form>

        {/* Show results when not loading */}
        {!isLoading && results && (
          <div className="border-t border-gray-200 mt-6">
            <ResultsDisplay results={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TdeeCalculator;
