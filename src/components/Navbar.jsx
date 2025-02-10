import React from "react";
import { FaUser } from "react-icons/fa6";

const Navbar = () => {
  return (
    <div className="flex items-center justify-center bg-color4 w-full h-16 md:h-[70px] px-4 py-2 ">
      <div className="flex items-center h-full w-full justify-center">
        <div className="flex items-center gap-4">
          <div className="w-full h-full font-bold sm:text-xl md:text-2xl lg:text-3xl text-purple-900  py-2 rounded-md ">
            XYZ Restaurant
          </div>
        </div>
      </div>

      <div className="hidden md:block pr-4">
        <FaUser alt="profile" className=" w-12 object-contain cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
