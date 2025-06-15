// ForgotPasswordModal.tsx
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEmail?: (email: string) => void; // optional parent notif
};

const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose, onSubmitEmail }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null; // Don’t render if closed

  const sendResetEmail = (userEmail: string, resetLink: string) => {
    const serviceID = "service_52nvnoe";
    const templateID = "template_nxzjoqp";
    const publicKey = "4IysWj2D8_Sgf7pKe";

    const templateParams = {
      reset_link: resetLink,
      email: userEmail,
    };

    return emailjs.send(serviceID, templateID, templateParams, publicKey);
  };

  const handleSubmit = async () => {
  setError("");
  setSuccessMsg("");

  if (!email) {
    setError("Please enter your email.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email.");
    return;
  }

  setIsSending(true);

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get reset token");
    }

    // Use the token from backend response to build the reset link
    const resetLink = `https://macrometer-calc.netlify.app/reset-password?token=${data.resetToken}&email=${encodeURIComponent(email)}`;
    
    // Then send the email with EmailJS (or you can move this to backend)
    await sendResetEmail(email, resetLink);
    console.log("Reset email sent successfully");
    setSuccessMsg("Check your email for the reset link!");
    if (onSubmitEmail) onSubmitEmail(email);
    setEmail("");
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message || "Failed to send email. Try again later.");
    } else {
      setError("Failed to send email. Try again later.");
    }
  } finally {
    setIsSending(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {successMsg && (
          <p className="text-green-700 bg-green-100 p-2 rounded mb-4 text-center">
            {successMsg}
          </p>
        )}

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={isSending}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
