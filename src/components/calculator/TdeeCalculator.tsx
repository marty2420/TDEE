import React, { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { TdeeInputs, calculateTDEE, TdeeResults } from '../../utils/tdeeCalculator';
import ResultsDisplay from './ResultsDisplay';
const TdeeCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TdeeInputs>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [results, setResults] = useState<TdeeResults | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) : value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResults = calculateTDEE(formData);
    setResults(calculatedResults);
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Calculate Your TDEE</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="age">
                Age
              </label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="15" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="gender">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="weight">
                Weight (kg)
              </label>
              <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} min="30" max="300" step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="height">
                Height (cm)
              </label>
              <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} min="100" max="250" step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="activityLevel">
                Activity Level
              </label>
              <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sedentary">
                  Sedentary (little or no exercise)
                </option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">
                  Moderate (exercise 3-5 days/week)
                </option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">
                  Very Active (hard exercise & physical job)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="goal">
                Goal
              </label>
              <select id="goal" name="goal" value={formData.goal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
            <span>Calculate</span>
            <ArrowRightIcon size={18} className="ml-2" />
          </button>
        </form>
      </div>
      {results && <div className="border-t border-gray-200">
          <ResultsDisplay results={results} />
        </div>}
    </div>;
};
export default TdeeCalculator;