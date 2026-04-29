import React, { useState } from "react";
import { Link } from "react-router-dom";

const emptyRegisterForm = {
  fullName: "",
  gmail: "",
  phone: "",
  password: "",
};

const emptyLoginForm = {
  gmail: "",
  password: "",
};

const Contact = () => {
  const [activeForm, setActiveForm] = useState("register");
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [message, setMessage] = useState("");

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
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

    localStorage.setItem("movieAppUser", JSON.stringify(registerForm));
    setMessage("Registration saved. You can see these details in Profile.");
    setRegisterForm(emptyRegisterForm);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("movieAppUser"));

    if (
      savedUser?.gmail === loginForm.gmail &&
      savedUser?.password === loginForm.password
    ) {
      localStorage.setItem("movieAppSession", JSON.stringify(savedUser));
      window.dispatchEvent(new Event("movieAppSessionChange"));
      setMessage(`Login successful. Welcome back, ${savedUser.fullName}.`);
      setLoginForm(emptyLoginForm);
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
            Register to save your movie preferences, or log in to continue
            exploring your watchlist.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10 sm:p-8">
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-primary p-2">
            <button
              className={`rounded-lg px-4 py-3 font-semibold transition ${
                activeForm === "register"
                  ? "bg-white text-primary"
                  : "text-light-200 hover:text-white"
              }`}
              onClick={() => setActiveForm("register")}
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
              onClick={() => setActiveForm("login")}
              type="button"
            >
              Login
            </button>
          </div>

          {activeForm === "register" ? (
            <form className="mt-8 grid gap-5" onSubmit={handleRegisterSubmit}>
              <h2>Create account</h2>
              <label className="grid gap-2 text-sm font-medium text-white">
                Full Name
                <input
                  className="rounded-lg border border-light-100/10 bg-primary px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                  onChange={handleRegisterChange}
                  name="fullName"
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
                  onChange={handleRegisterChange}
                  name="gmail"
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
                  onChange={handleRegisterChange}
                  name="phone"
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
                  onChange={handleRegisterChange}
                  name="password"
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
                  onChange={handleLoginChange}
                  name="gmail"
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
                  onChange={handleLoginChange}
                  name="password"
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
                <Link
                  className="mt-3 inline-flex font-semibold text-white hover:text-light-100"
                  to="/profile"
                >
                  View Profile
                </Link>
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
        </div>
      </section>
    </main>
  );
};

export default Contact;
