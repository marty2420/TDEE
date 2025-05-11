import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignupForm: React.FC = () => {
  const [emailError, setEmailError] = useState('');  // <-- This is the new state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Password validation effect
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setIsPasswordValid(false);
      setError('Passwords do not match');
    } else {
      setIsPasswordValid(true);
      setError('');
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');  // Reset email error on submit
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }  
    if (!isPasswordValid) {
      return; // Prevent submission if passwords don't match
    }
    setIsLoading(true);
    try {
      const result = await signup(name, email, password);
      if (result === true) {
        navigate('/login');
      } else if (typeof result === 'string') {
        if (result === 'Email already exists') {
          setEmailError(result);  // Show "User already exists" near the email input
        } else {
          setError(result); // Other errors
        }
      } else {
        setError('Failed to create account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircleIcon size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon size={18} className="text-gray-500" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon size={18} className="text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1 pl-1">{emailError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon size={18} className="text-gray-500" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon size={18} className="text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>
        <button
  type="submit"
  disabled={isLoading}
  className="w-full bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#2f4b44] focus:outline-none focus:ring-2 focus:ring-[#3C5C54] focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
>
  {isLoading ? 'Creating account...' : 'Sign Up'}
</button>
      </form>
    </div>
  );  
};

export default SignupForm;
