import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ActivityIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
<nav className="text-white shadow-md" style={{ backgroundColor: '#3C5C54' }}>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
       <div className="flex items-center space-x-2 text-xl font-bold cursor-default">
  <ActivityIcon size={24} />
  <span>MacroMeter</span>
</div>

        <div className="flex items-center space-x-4">
          {user ? (
            location.pathname === '/dashboard' ? ( // Check if we're on the dashboard page
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-200">
                  <UserIcon size={18} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-blue-200">
                  <LogOutIcon size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <></> // Don't show anything else for logged-in users who aren't on the dashboard
            )
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/signup" className="bg-white text-[#3C5C54] px-3 py-1 rounded-md hover:bg-[#c1ccc8] transition-colors duration-200"> 
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
