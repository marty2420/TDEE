import React from "react";
import { TdeeResults } from "../../utils/tdeeCalculator";
import { FlameIcon, ActivityIcon, TargetIcon, BeefIcon } from "lucide-react";
interface ResultsDisplayProps {
  results: TdeeResults;
}
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FlameIcon size={20} className="text-blue-600 mr-2" />
            <h4 className="font-medium">Basal Metabolic Rate</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.bmr}{" "}
            <span className="text-sm font-normal text-gray-600">
              calories/day
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Calories burned at complete rest
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <ActivityIcon size={20} className="text-green-600 mr-2" />
            <h4 className="font-medium">Total Daily Energy</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.tdee}{" "}
            <span className="text-sm font-normal text-gray-600">
              calories/day
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Calories burned daily with activity
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TargetIcon size={20} className="text-purple-600 mr-2" />
            <h4 className="font-medium">Target Intake</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.targetCalories}{" "}
            <span className="text-sm font-normal text-gray-600">
              calories/day
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Daily calories for your goal
          </p>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4">Recommended Macronutrients</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BeefIcon size={20} className="text-red-600 mr-2" />
            <h4 className="font-medium">Protein</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.protein}g{" "}
            <span className="text-sm font-normal text-gray-600">
              ({results.protein * 4} cal)
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{
                width: `${
                  ((results.protein * 4) / results.targetCalories) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FlameIcon size={20} className="text-amber-600 mr-2" />
            <h4 className="font-medium">Carbohydrates</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.carbs}g{" "}
            <span className="text-sm font-normal text-gray-600">
              ({results.carbs * 4} cal)
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-amber-600 h-2 rounded-full"
              style={{
                width: `${
                  ((results.carbs * 4) / results.targetCalories) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FlameIcon size={20} className="text-blue-600 mr-2" />
            <h4 className="font-medium">Fat</h4>
          </div>
          <p className="text-2xl font-bold">
            {results.fat}g{" "}
            <span className="text-sm font-normal text-gray-600">
              ({results.fat * 9} cal)
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${((results.fat * 9) / results.targetCalories) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultsDisplay;
