import React from "react";
import { NavLink, useNavigate } from "react-router";
import { assets } from "../assets/assets";
import { XIcon, MenuIcon, TicketPlus } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 transition-all duration-300">
      <NavLink to="/" className="text-lg font-semibold">
        <img src={assets.movTickLogo} alt="" className="w-36 h-auto" />
      </NavLink>
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen max-md:text-2xl max-md:bg-white/10 backdrop-blur z-50 flex flex-col md:flex-row justify-center md:bg-white/10 md:py-4 md:px-8 md:rounded-full border md:border-gray-300 items-center gap-8 md:gap-6 text-md font-semibold text-shadow-white transition-all duration-300 ${
          isOpen
            ? "max-md:w-full"
            : "max-md:w-0 max-md:overflow-hidden max-md:invisible"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-8 h-8 cursor-pointer"
          onClick={toggleMenu}
        />
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-accent border-b-2 border-primary" : ""
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "text-accent border-b-2 border-primary" : ""
          }
        >
          Movies
        </NavLink>
        <NavLink
          to="/theatres"
          className={({ isActive }) =>
            isActive ? "text-accent border-b-2 border-primary" : ""
          }
        >
          Theatres
        </NavLink>
        <NavLink
          to="/releases"
          className={({ isActive }) =>
            isActive ? "text-accent border-b-2 border-primary" : ""
          }
        >
          Releases
        </NavLink>
        <NavLink
          to="/favourite"
          className={({ isActive }) =>
            isActive ? "text-accent border-b-2 border-primary" : ""
          }
        >
          Favourites
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-6 py-2 text-lg font-semibold text-shadow-white bg-primary rounded-full hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center justify-center p-0 border-primary border-2 rounded-full">
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  onClick={() => navigate("/my-bookings")}
                  labelIcon={<TicketPlus width={16} />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        )}

        <MenuIcon
          className="md:hidden w-6 h-6 cursor-pointer"
          onClick={toggleMenu}
        />
      </div>
    </div>
  );
};

export default Navbar;
