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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <ActivityIcon size={24} />
          <span>MacroMeter</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            location.pathname === '/dashboard' ? (  // Check if we're on the dashboard page
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
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100">
                  Sign Up
                </Link>
              </>
            )
          ) : (
            <>
              
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
