import React, { useState } from "react";

const USERS_STORAGE_KEY = "movieAppUsers";

const emptyUser = {
  fullName: "",
  gmail: "",
  phone: "",
  password: "",
  profileImage: "",
};

const getSessionUser = () => {
  try {
    return JSON.parse(localStorage.getItem("movieAppSession"));
  } catch {
    return null;
  }
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

export const Profile = () => {
  const sessionUser = getSessionUser();
  const [user, setUser] = useState(sessionUser);
  const [editUser, setEditUser] = useState(sessionUser || emptyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditUser((currentUser) => ({
      ...currentUser,
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
      setEditUser((currentUser) => ({
        ...currentUser,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    const users = getRegisteredUsers();
    const updatedUsers = users.map((registeredUser) =>
      registeredUser.gmail === user.gmail
        ? { ...editUser, id: registeredUser.id }
        : registeredUser
    );
    const updatedUser = { ...editUser, id: user.id };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem("movieAppUser", JSON.stringify(updatedUser));
    localStorage.setItem("movieAppSession", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setMessage("Profile updated successfully.");
    window.dispatchEvent(new Event("movieAppSessionChange"));
  };

  const handleDelete = () => {
    const users = getRegisteredUsers();
    const updatedUsers = users.filter(
      (registeredUser) => registeredUser.gmail !== user.gmail
    );

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.removeItem("movieAppUser");
    localStorage.removeItem("movieAppSession");
    setUser(null);
    setEditUser(emptyUser);
    setIsEditing(false);
    setMessage("Profile deleted successfully.");
    window.dispatchEvent(new Event("movieAppSessionChange"));
  };

  const displayName = user?.fullName || "Movie Fan";
  const displayEmail = user?.gmail || "No logged-in Gmail";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <main>
      <section className="wrapper gap-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-lg border border-light-100/10 bg-dark-100 p-6 shadow-inner shadow-light-100/10 sm:p-8">
            <div className="flex items-center gap-4">
              {user?.profileImage ? (
                <img
                  alt={displayName}
                  className="size-20 rounded-full border border-light-100/20 object-cover"
                  src={user.profileImage}
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-full bg-white text-3xl font-bold text-primary">
                  {avatarLetter}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-light-200">
                  Profile
                </p>
                <h2 className="mt-1">{displayName}</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-lg bg-primary p-4">
                <p className="text-sm text-gray-100">Email</p>
                <p className="mt-1 font-semibold text-white">
                  {displayEmail}
                </p>
              </div>
              <div className="rounded-lg bg-primary p-4">
                <p className="text-sm text-gray-100">Phone</p>
                <p className="mt-1 font-semibold text-white">
                  {user?.phone || "No phone added"}
                </p>
              </div>
              <div className="rounded-lg bg-primary p-4">
                <p className="text-sm text-gray-100">Membership</p>
                <p className="mt-1 font-semibold text-white">Free Viewer</p>
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10 sm:p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-light-200">
              Your dashboard
            </p>
            <h1 className="mx-0 max-w-none text-left">Welcome back.</h1>
            <p className="mt-5 max-w-2xl leading-8 text-light-200">
              {user
                ? "Only your logged-in profile details are shown here."
                : "No user is logged in. Please login from the Contact page to show your profile here."}
            </p>

            {message && (
              <p className="mt-5 rounded-lg border border-light-100/10 bg-primary p-4 text-sm text-light-200">
                {message}
              </p>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="rounded-lg bg-primary p-5">
                <p className="text-3xl font-bold text-white">12</p>
                <p className="mt-2 text-sm text-gray-100">Saved Movies</p>
              </div>
              <div className="rounded-lg bg-primary p-5">
                <p className="text-3xl font-bold text-white">5</p>
                <p className="mt-2 text-sm text-gray-100">Watched</p>
              </div>
              <div className="rounded-lg bg-primary p-5">
                <p className="text-3xl font-bold text-white">3</p>
                <p className="mt-2 text-sm text-gray-100">Reviews</p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-light-100/10 bg-primary p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h2>Registration details</h2>
                {user && (
                  <div className="flex gap-3">
                    <button
                      className="rounded-lg border border-light-100/20 px-4 py-2 font-semibold text-white transition hover:border-light-100/50"
                      onClick={() => {
                        setIsEditing(true);
                        setMessage("");
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-white px-4 py-2 font-semibold text-primary transition hover:bg-light-100"
                      onClick={handleDelete}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {!user && (
                <p className="mt-5 text-light-200">
                  Login first to manage profile details.
                </p>
              )}

              {user && !isEditing && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-100">Full Name</p>
                    <p className="mt-1 font-semibold text-white">
                      {user.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Gmail</p>
                    <p className="mt-1 font-semibold text-white">
                      {user.gmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Phone Number</p>
                    <p className="mt-1 font-semibold text-white">
                      {user.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-100">Password</p>
                    <p className="mt-1 font-semibold text-white">
                      {"*".repeat(user.password.length)}
                    </p>
                  </div>
                </div>
              )}

              {user && isEditing && (
                <form className="mt-5 grid gap-5" onSubmit={handleUpdate}>
                  <label className="grid gap-2 text-sm font-medium text-white">
                    Profile Image
                    <input
                      accept="image/*"
                      className="rounded-lg border border-light-100/10 bg-dark-100 px-4 py-3 text-white outline-none transition file:mr-4 file:rounded file:border-0 file:bg-white file:px-3 file:py-2 file:font-semibold file:text-primary focus:border-light-100/40"
                      onChange={handleImageChange}
                      type="file"
                    />
                  </label>

                  {editUser.profileImage && (
                    <img
                      alt="Profile preview"
                      className="size-24 rounded-full border border-light-100/20 object-cover"
                      src={editUser.profileImage}
                    />
                  )}

                  <label className="grid gap-2 text-sm font-medium text-white">
                    Full Name
                    <input
                      className="rounded-lg border border-light-100/10 bg-dark-100 px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                      name="fullName"
                      onChange={handleEditChange}
                      required
                      type="text"
                      value={editUser.fullName}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-white">
                    Gmail
                    <input
                      className="rounded-lg border border-light-100/10 bg-dark-100 px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                      name="gmail"
                      onChange={handleEditChange}
                      required
                      type="email"
                      value={editUser.gmail}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-white">
                    Phone Number
                    <input
                      className="rounded-lg border border-light-100/10 bg-dark-100 px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                      name="phone"
                      onChange={handleEditChange}
                      required
                      type="tel"
                      value={editUser.phone}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-white">
                    Password
                    <input
                      className="rounded-lg border border-light-100/10 bg-dark-100 px-4 py-3 text-white outline-none transition focus:border-light-100/40"
                      name="password"
                      onChange={handleEditChange}
                      required
                      type="password"
                      value={editUser.password}
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      className="rounded-lg border border-light-100/20 px-5 py-3 font-semibold text-white transition hover:border-light-100/50"
                      onClick={() => {
                        setEditUser(user);
                        setIsEditing(false);
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
