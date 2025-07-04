import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordModal from "../../utils/ForgotPasswordModal";
import ResetPasswordModal from "../../utils/ResetPasswordModal"; // Create this one next

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    if (emailParam && tokenParam) {
      setResetEmail(emailParam);
      setResetToken(tokenParam);
      setShowResetModal(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotSubmit = async (email: string) => {
    console.log("Email submitted for reset:", email);
    // you can handle after forgot password email submission here if needed
  };

  return (
    <>
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircleIcon size={18} />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon size={18} className="text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3C5C54] text-white py-2 px-4 rounded-md hover:bg-[#2f4b44] focus:outline-none focus:ring-2 focus:ring-[#3C5C54] focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="text-right mb-6">
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-blue-600 hover:underline mt-4"
              type="button"
            >
              Forgot Password?
            </button>

            <ForgotPasswordModal
              isOpen={showForgotModal}
              onClose={() => setShowForgotModal(false)}
              onSubmitEmail={handleForgotSubmit}
            />
          </div>
        </form>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        email={resetEmail}
        token={resetToken}
      />
    </>
  );
};

export default LoginForm;
