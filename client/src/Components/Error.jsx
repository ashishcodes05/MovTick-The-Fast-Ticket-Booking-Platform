import { ArrowRight } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

const Error = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
        404 Not Found
      </h1>
      <div className="h-px w-80 rounded bg-gradient-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
      <p className="md:text-xl text-gray-400 max-w-lg text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <NavLink
        to="/"
        className="group flex items-center gap-1 bg-primary hover:bg-accent hover:text-primary px-7 py-2.5 text-accent rounded-full mt-10 font-medium active:scale-95 transition-all"
      >
        Back to Home
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </NavLink>
    </div>
  );
};

export default Error;
