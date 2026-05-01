import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const USERS_STORAGE_KEY = "movieAppUsers";

const emptyRegisterForm = {
  fullName: "",
  gmail: "",
  phone: "",
  password: "",
  profileImage: "",
};

const emptyLoginForm = {
  gmail: "",
  password: "",
};

const getRegisteredUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
    const oldUser = JSON.parse(localStorage.getItem("movieAppUser"));

    if (Array.isArray(users)) {
      return users;
    }

    return oldUser ? [oldUser] : [];
  } catch {
    return [];
  }
};

const getSessionUser = () => {
  try {
    return JSON.parse(localStorage.getItem("movieAppSession"));
  } catch {
    return null;
  }
};

const Contact = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("register");
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [message, setMessage] = useState("");
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

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setRegisterForm((currentForm) => ({
        ...currentForm,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    const users = getRegisteredUsers();
    const existingUser = users.find(
      (user) => user.gmail.toLowerCase() === registerForm.gmail.toLowerCase()
    );

    if (existingUser) {
      setMessage("This Gmail is already registered. Please login instead.");
      return;
    }

    const newUser = {
      ...registerForm,
      id: Date.now(),
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem("movieAppUser", JSON.stringify(newUser));
    setMessage("Registration saved. You can login with these details now.");
    setRegisterForm(emptyRegisterForm);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const users = getRegisteredUsers();
    const savedUser = users.find(
      (user) =>
        user.gmail.toLowerCase() === loginForm.gmail.toLowerCase() &&
        user.password === loginForm.password
    );

    if (savedUser) {
      localStorage.setItem("movieAppSession", JSON.stringify(savedUser));
      window.dispatchEvent(new Event("movieAppSessionChange"));
      setSessionUser(savedUser);
      setLoginForm(emptyLoginForm);
      navigate("/");
    } else {
      setMessage("Login failed. Please check your Gmail and password.");
    }
  };

  return (
    <main>
      <section className="wrapper gap-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-light-200">
            Account access
          </p>
          <h1>Join the movie community.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-light-200 sm:text-lg">
            Register with your profile image, or login to show only your own
            details in the navbar and profile page.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10 sm:p-8">
          {sessionUser ? (
            <div className="text-center">
              {sessionUser.profileImage ? (
                <img
                  alt={sessionUser.fullName}
                  className="mx-auto size-24 rounded-full border border-light-100/20 object-cover"
                  src={sessionUser.profileImage}
                />
              ) : (
                <div className="mx-auto grid size-24 place-items-center rounded-full bg-white text-3xl font-bold text-primary">
                  {sessionUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="mt-5">You are already logged in</h2>
              <p className="mt-3 text-light-200">
                Welcome back, {sessionUser.fullName}. Logout from the navbar to
                register or login with another account.
              </p>
              <Link
                className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                to="/"
              >
                Go Home
              </Link>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-primary p-2">
            <button
              className={`rounded-lg px-4 py-3 font-semibold transition ${
                activeForm === "register"
                  ? "bg-white text-primary"
                  : "text-light-200 hover:text-white"
              }`}
              onClick={() => {
                setActiveForm("register");
                setMessage("");
              }}
              type="button"
            >
              Register
            </button>
            <button
              className={`rounded-lg px-4 py-3 font-semibold transition ${
                activeForm === "login"
                  ? "bg-white text-primary"
                  : "text-light-200 hover:text-white"
              }`}
              onClick={() => {
                setActiveForm("login");
                setMessage("");
              }}
              type="button"
            >
              Login
            </button>
          </div>

          {activeForm === "register" ? (
            <form className="mt-8 grid gap-5" onSubmit={handleRegisterSubmit}>
              <h2>Create account</h2>

              <label className="grid gap-2 text-sm font-medium text-white">
                Profile Image
                <input
                  accept="image/*"
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition file:mr-4 file:rounded file:border-0 file:bg-white file:px-3 file:py-2 file:font-semibold file:text-primary focus:border-light-100/40"
                  onChange={handleImageChange}
                  type="file"
                />
              </label>

              {registerForm.profileImage && (
                <img
                  alt="Profile preview"
                  className="size-24 rounded-full border border-light-100/20 object-cover"
                  src={registerForm.profileImage}
                />
              )}

              <label className="grid gap-2 text-sm font-medium text-white">
                Full Name
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="fullName"
                  onChange={handleRegisterChange}
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={registerForm.fullName}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Gmail
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="gmail"
                  onChange={handleRegisterChange}
                  placeholder="Enter your Gmail"
                  required
                  type="email"
                  value={registerForm.gmail}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Phone Number
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="phone"
                  onChange={handleRegisterChange}
                  placeholder="Enter your phone number"
                  required
                  type="tel"
                  value={registerForm.phone}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Password
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="password"
                  onChange={handleRegisterChange}
                  placeholder="Create a password"
                  required
                  type="password"
                  value={registerForm.password}
                />
              </label>

              <button
                className="rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                type="submit"
              >
                Register Now
              </button>
            </form>
          ) : (
            <form className="mt-8 grid gap-5" onSubmit={handleLoginSubmit}>
              <h2>Login</h2>
              <label className="grid gap-2 text-sm font-medium text-white">
                Gmail
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="gmail"
                  onChange={handleLoginChange}
                  placeholder="Enter your Gmail"
                  required
                  type="email"
                  value={loginForm.gmail}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-white">
                Password
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  name="password"
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={loginForm.password}
                />
              </label>

              <button
                className="rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                type="submit"
              >
                Login
              </button>
            </form>
          )}

          {message && (
            <div className="mt-6 rounded-lg border border-light-100/10 bg-primary p-4 text-sm text-light-200">
              <p>{message}</p>
              {message.includes("Registration saved") && (
                <button
                  className="mt-3 inline-flex font-semibold text-white hover:text-light-100"
                  onClick={() => {
                    setActiveForm("login");
                    setMessage("");
                  }}
                  type="button"
                >
                  Login Now
                </button>
              )}
              {message.includes("Login successful") && (
                <Link
                  className="mt-3 inline-flex font-semibold text-white hover:text-light-100"
                  to="/profile"
                >
                  Go to Profile
                </Link>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contact;
