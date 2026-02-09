import React from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const layout = ({ children }) => {
  return (
    <div className=" flex flex-col items-center">
      {" "}
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
