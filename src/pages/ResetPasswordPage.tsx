import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ResetPasswordModal from '../utils/ResetPasswordModal';


const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={email}
        token={token}
      />
    </>
  );
};

export default ResetPasswordPage;
