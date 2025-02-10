import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaUser } from "react-icons/fa";
import RestaurantLogo from "../assets/Restaurant logo.jpg";

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex flex-col bg-color3 w-24 h-screen shadow-lg">
        <div className="p-4 flex justify-center">
          <img
            src={RestaurantLogo}
            alt="Logo"
            className="w-28 h-25 rounded-full"
          />
        </div>
        <div className="flex-grow p-2 space-y-4">
          <Link
            to="/"
            className="flex flex-col items-center p-2 text-xs font-bold text-color3"
          >
            <FaChartLine className="w-6 h-6 text-color3" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 w-full bg-white flex justify-around py-2 shadow-md md:hidden">
        <Link to="/" className="flex flex-col items-center text-color3">
          <FaChartLine className="w-6 h-6" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-color3">
          <FaUser className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
