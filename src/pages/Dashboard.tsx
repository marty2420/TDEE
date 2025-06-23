import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTdee } from "../context/TdeeContext.tsx";
import TdeeCalculator from "../components/calculator/TdeeCalculator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isUpdating } = useTdee();
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handlePasswordChange = async () => {
    if (newPass !== confirmPass) {
      toast.error("New passwords do not match!!");
      return;
    }

    try {
      const token = localStorage.getItem("tdeeToken");
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${BASE_URL}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Password changed successfully!");
      setShowAccountModal(false);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Error changing password");
      } else {
        toast.error("Error changing password");
      }
    }
  };
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isUpdating) {
      setShowSpinner(true);
    } else {
      const timeout = setTimeout(() => setShowSpinner(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isUpdating]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleDelete = async () => {
    if (deleteInput === user.name) {
      try {
        const token = localStorage.getItem("tdeeToken");

        if (!token) {
          toast.error("No token found! Please log in again.");
          return;
        }

        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${BASE_URL}/api/users/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to delete account");

        toast.success("Account deleted successfully! See ya later, champ!");
        localStorage.removeItem("tdeeToken");
        navigate("/login");
      } catch (err) {
        toast.error("Oops! Error deleting account. Try again later.");
        console.error(err);
      }
    } else {
      toast.warn("Account name does not match. Double-check and try again.");
    }
  };
  
   const handleSaveWorkoutPrefs = async () => {
    try {
     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
     const response = await fetch(`${API_BASE_URL}/api/users/workout-prefs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // Use the user's unique identifier
          workoutPrefs: {
            selectedDays: selectedDays,
            hoursPerDay: hoursPerDay,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong");

      console.log("Saved workout prefs ✅", data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to save workout prefs ❌", err.message);
      } else {
        console.error("Failed to save workout prefs ❌", err);
      }
    } finally {
      setShowWorkoutModal(false);
      setShowGenerateButton(true);
    }
  };

const handleGenerateWorkoutPlan = async () => {
  setIsLoading(true); // Start loading
  const userInput = {
    input: {
      age: user.input?.age,
      gender: user.input?.gender,
      goal: user.input?.goal,
    },
    workoutPrefs: {
      hoursPerDay,
      selectedDays,
    },
  };

  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${API_BASE_URL}/api/users/generate-workout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    });

    const data = await res.json();
    if (data.plan) setWorkoutPlan(data.plan);
    else toast.error("Failed to generate plan");
  } catch (error) {
    toast.error("Something went wrong.");
  } finally {
    setIsLoading(false); // Stop loading
  }
};

const handleDownloadPDF = () => {
  if (!workoutPlan) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 10;
  const lineHeight = 7;
  const pageHeight = 297; // A4 page height in mm
  const maxLineWidth = 190;

  // Split long text into lines that fit the page
  const lines = doc.splitTextToSize(workoutPlan, maxLineWidth);

  let y = margin;

  // Add Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Your AI-Generated Workout Plan", margin, y);
  y += 10;

  // Set content font
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage(); // Add new page if line overflows
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.save("Workout_Plan.pdf");
};

 return (
    <div className="max-w-6xl mx-auto">
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
              <button
                onClick={() => setShowAccountModal(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
              >
                <SettingsIcon size={18} />
                <span>Account Settings</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            {showSpinner ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Track your nutrition journey and body composition changes over
                  time.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Age:</strong> {user.input?.age} yrs
                  </p>
                  <p>
                    <strong>Gender:</strong> {user.input?.gender}
                  </p>
                  <p>
                    <strong>Weight:</strong> {user.input?.weight} kg
                  </p>
                  <p>
                    <strong>Height:</strong> {user.input?.height} cm
                  </p>
                  <p>
                    <strong>Activity Level:</strong> {user.input?.activityLevel}
                  </p>
                  <p>
                    <strong>Goal:</strong> {user.input?.goal}
                  </p>
                  <p>
                    <strong>BMR:</strong> {user.tdeeResults?.bmr} kcal
                  </p>
                  <p>
                    <strong>TDEE:</strong> {user.tdeeResults?.tdee} kcal
                  </p>
                  <p>
                    <strong>Target Calories:</strong>{" "}
                    {user.tdeeResults?.targetCalories} kcal
                  </p>
                  <p>
                    <strong>Protein:</strong> {user.tdeeResults?.protein} g
                  </p>
                  <p>
                    <strong>Carbs:</strong> {user.tdeeResults?.carbs} g
                  </p>
                  <p>
                    <strong>Fat:</strong> {user.tdeeResults?.fat} g
                  </p>
                </div>
                <div className="mt-4 bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-bold">
                    AI-Generated Workout Plan
                  </h2>
                  <p className="text-sm text-muted">
                    Customized based on your goal and schedule.
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowWorkoutModal(true)}
                      className="w-full bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#4D6C5B] focus:outline-none focus:ring-2 focus:ring-[#4D6C5B] focus:ring-offset-2 flex items-center justify-center transition-colors duration-300"
                    >
                      Click here!
                       </button>
                    {showGenerateButton && (
                      <button
                        onClick={handleGenerateWorkoutPlan}
                        className="mt-4 w-full bg-[#3C5C54] text-white py-2 rounded-md hover:bg-[#2f4b44] transition"
                      >
                        Generate Workout Plan
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-6">Your TDEE Calculator</h1>
          <TdeeCalculator />
        </div>
      </div>
      

      {showWorkoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Customize Workout Plan
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days per Week
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "monday",            
                  "Friday",
                  "tuesday",
                  "saturday",
                  "Wednesday",
                  "Sunday",
                  "Thursday",
                ].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDays([...selectedDays, day]);
                        } else {
                          setSelectedDays(
                            selectedDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      className="accent-[#3C5C54]"
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours per Day
              </label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {[0.5, 1, 1.5, 2, 2.5, 3].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} hour(s)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowWorkoutModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
                <button
                onClick={handleSaveWorkoutPrefs} // you'll define this
                className="text-white py-2 px-4 rounded-md bg-[#3C5C54] hover:bg-[#4D6C5B] transition"
              >
                OKAY
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
  <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
    GENERATING WORKOUT PLAN...
  </div>
)}

{!isLoading && workoutPlan && (
  <div id="workout-plan" className="mt-4 p-4 border rounded bg-gray-50 max-h-[500px] overflow-y-auto">
    <pre className="whitespace-pre-wrap">{workoutPlan}</pre>
  </div>
)}
{workoutPlan && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setWorkoutPlan(null)}
  >
    <div
      className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[70vh] overflow-y-auto shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold mb-4 text-center">Your Workout Plan</h3>
      <pre id="workout-plan" className="whitespace-pre-wrap">{workoutPlan}</pre>

      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-4 py-2 bg-[#3C5C54] text-white rounded hover:bg-[#4D6C5B] transition"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>

        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          onClick={() => setWorkoutPlan(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
{workoutPlan && (
  <div id="workout-plan" className="mt-4 p-4 border rounded bg-gray-50">
    <pre className="whitespace-pre-wrap">{workoutPlan}</pre>
  </div>
)}

      {/* Account Settings Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-center">Account Settings</h2>
            {showChangePasswordModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                  <h2 className="text-xl font-bold text-center">
                    Change Password
                  </h2>

                  <input
                    type={showPasswords ? "text" : "password"}
                    placeholder="Current Password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />

                  <input
                    type={showPasswords ? "text" : "password"}
                    placeholder="New Password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />

                  <input
                    type={showPasswords ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />

                  {/* Show password toggle */}
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={() => setShowPasswords(!showPasswords)}
                    />
                    <span className="text-sm select-none">Show Passwords</span>
                  </label>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowChangePasswordModal(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#4D6C5B] transition"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#4D6C5B] transition"
            >
              Change Password
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete Account
            </button>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded-md text-white bg-gray-700 hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-center text-red-600">
              Delete Account
            </h2>
            <p className="text-sm text-gray-600">
              Are you absolutely sure you want to delete your account named{" "}
              <span className="font-semibold">{user.name}</span>?
            </p>

            <p className="text-sm font-semibold text-red-500">
              This action cannot be undone.
            </p>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={`Type account name ${user.name} to confirm`}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />

            {/* Copyable username with feedback */}
            <div className="relative inline-block mt-2">
              <p
                onClick={() => {
                  navigator.clipboard.writeText(user.name);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000); // reset after 2s
                }}
                title="Click to copy username"
                className="cursor-pointer select-all text-black rounded px-2 bg-white max-w-max font-tahoma font-thin border border-gray-300 inline-block"
                style={{
                  fontFamily:
                    "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}
                >
                  {user.name}
                </span>{" "}
                <span
                  className="ml-1 text-gray-400"
                  style={{
                    fontSize: "0.5rem",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}
                >
                  (click to copy)
                </span>
              </p>

              {copied && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[0.55rem] text-green-500">
                  Copied!
                </span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteInput === user.name) {
                    setShowConfirmDelete(true); // Show the confirmation prompt
                  } else {
                    toast.warn(
                      "Project name does not match. Double-check and try again."
                    );
                  }
                }}
                className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md"
              >
                Delete
              </button>
              {showConfirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                    <h2 className="text-lg font-bold text-red-600 mb-2">
                      Final Confirmation
                    </h2>
                    <p className="text-sm text-gray-700 mb-4">
                      Are you sure you want to permanently delete your account,{" "}
                      <span className="font-semibold">{user.name}</span>? This
                      action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmDelete(false);
                          handleDelete();
                        }}
                        className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;