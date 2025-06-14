import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  token: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  token,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  const resetPasswordApi = async (
    userEmail: string,
    resetToken: string,
    newPass: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          token: resetToken,
          newPassword: newPass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || "Reset failed" };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPasswordApi(email, token, newPassword);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Keep JSX after hooks only
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <p className="mb-4 text-gray-600 text-sm">
          Reset password for <strong>{email}</strong>
        </p>

        {error && (
          <div className="mb-3 text-red-600 text-sm font-medium">{error}</div>
        )}

        {success && (
          <div className="mb-3 text-green-600 text-sm font-medium">
            Password reset successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type={showPasswords ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || success}
            minLength={6}
          />

          <input
            type={showPasswords ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || success}
            minLength={6}
          />

          {/* Show Passwords Toggle */}
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
              className="accent-[#3C5C54]"
            />
            <span className="text-sm text-gray-600 select-none">
              Show Passwords
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-[#3C5C54] text-white py-2 rounded-md hover:bg-[#2f4b44] transition"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          className="mt-3 text-sm text-gray-500 hover:underline"
          onClick={onClose}
          disabled={isSubmitting}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
