export interface TdeeInputs {
  age: number;
  gender: 'male' | 'female';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}
export interface TdeeResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}
// Activity level multipliers
const activityMultipliers = {
  sedentary: 1.2,
  // Little or no exercise
  light: 1.375,
  // Light exercise 1-3 days/week
  moderate: 1.55,
  // Moderate exercise 3-5 days/week
  active: 1.725,
  // Hard exercise 6-7 days/week
  very_active: 1.9 // Very hard exercise & physical job
};
// Goal adjustments (percentage of TDEE)
const goalAdjustments = {
  lose: 0.8,
  // 20% deficit
  maintain: 1.0,
  // No change
  gain: 1.1 // 10% surplus
};
export const calculateTDEE = (inputs: TdeeInputs): TdeeResults => {
  let bmr = 0;
  // Calculate BMR using Mifflin-St Jeor Equation
  if (inputs.gender === 'male') {
    bmr = 10 * inputs.weight + 6.25 * inputs.height - 5 * inputs.age + 5;
  } else {
    bmr = 10 * inputs.weight + 6.25 * inputs.height - 5 * inputs.age - 161;
  }
  // Calculate TDEE
  const tdee = bmr * activityMultipliers[inputs.activityLevel];
  // Calculate target calories based on goal
  const targetCalories = tdee * goalAdjustments[inputs.goal];
  // Calculate macronutrients (simplified approach)
  // Protein: 2g per kg of bodyweight
  const protein = inputs.weight * 2;
  // Fat: 25% of total calories
  const fat = targetCalories * 0.25 / 9;
  // Remaining calories from carbs
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = carbCalories / 4;
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat)
  };
};