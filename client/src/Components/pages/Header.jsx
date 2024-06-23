import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 flex-wrap">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-gray-400">Aman</span>
            <span className="text-gray-200">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-2 sm:p-3 rounded-lg flex items-center mt-2 sm:mt-0"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 text-gray-300 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-gray-400" />
          </button>
        </form>
        <ul className="flex gap-2 sm:gap-4 mt-2 sm:mt-0">
          <Link to="/">
            <li className="text-gray-200 hover:underline hidden sm:inline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-gray-200 hover:underline hidden sm:inline">
              About
            </li>
          </Link>
          {currentUser && currentUser.user ? (
            <Link to="/profile">
              {currentUser.user.avatar?.secure_url ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.user.avatar.secure_url}
                  alt="profile"
                />
              ) : (
                <BsPersonCircle className="rounded-full h-7 w-7 text-gray-200" />
              )}
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className="text-gray-200 hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
