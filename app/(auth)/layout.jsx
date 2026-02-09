import React from "react";
import AuthLeftSide from "../components/auth/AuthLeftSide";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AuthLeftSide />
      {children}
    </div>
  );
};

export default AuthLayout;
