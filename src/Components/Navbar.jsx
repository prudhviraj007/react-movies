import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getSessionUser = () => {
  try {
    return JSON.parse(localStorage.getItem("movieAppSession"));
  } catch {
    return null;
  }
};

const Navbar = () => {
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());

  useEffect(() => {
    const syncSession = () => {
      setSessionUser(getSessionUser());
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener("movieAppSessionChange", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("movieAppSessionChange", syncSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("movieAppSession");
    setSessionUser(null);
    window.dispatchEvent(new Event("movieAppSessionChange"));
  };

  const displayName = sessionUser?.fullName || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-black px-6 py-4 text-white shadow-md">
      <Link to="/" className="text-xl font-bold text-gradient">
        MyApp
      </Link>

      <ul className="flex flex-wrap items-center gap-6 text-sm font-medium">
        <li>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about-us" className="hover:text-gray-300">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </li>

        {sessionUser ? (
          <li className="group relative">
            <button
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              type="button"
            >
              <span className="grid size-9 place-items-center rounded-full bg-white font-bold text-primary">
                {avatarLetter}
              </span>
              <span>{displayName}</span>
            </button>

            <div className="invisible absolute right-0 top-full z-20 w-40 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-lg border border-light-100/10 bg-dark-100 p-2 shadow-xl shadow-black/30">
                <Link
                  className="block rounded px-3 py-2 text-sm hover:bg-white/10"
                  to="/profile"
                >
                  Profile
                </Link>
                <button
                  className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/contact" className="hover:text-gray-300">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
