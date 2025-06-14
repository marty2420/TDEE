import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ActivityIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const location = useLocation(); // Get the current location

  return (
    <nav
      className="text-white shadow-md"
      style={{ backgroundColor: "#3C5C54" }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-xl font-bold cursor-default">
          <ActivityIcon size={24} />
          <span>MacroMeter</span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            location.pathname === "/dashboard" ? ( // Check if we're on the dashboard page
              <>
                <UserIcon size={18} />
                <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                  {user.name}
                </span>
              </>
            ) : (
              <></> // Don't show anything else for logged-in users who aren't on the dashboard
            )
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-[#3C5C54] px-3 py-1 rounded-md hover:bg-[#c1ccc8] transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
