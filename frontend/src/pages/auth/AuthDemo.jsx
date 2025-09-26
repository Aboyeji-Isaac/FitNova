// AuthDemo.jsx
import React, { useState } from "react";

const fakeUser = { username: "testuser", password: "123456" };

export default function AuthDemo() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username === fakeUser.username && password === fakeUser.password) {
      setLoggedIn(true);
      setMessage("✅ Login successful!");
    } else {
      setMessage("❌ Invalid username or password");
    }
  };

  const handleRegister = () => {
    // This doesn't store permanently — just fakes a register success
    setMessage("✅ Registered successfully! You can now log in.");
    setPage("login");
  };

  if (loggedIn) {
    return (
      <div className="p-4">
        <h2>Welcome, {username} 🎉</h2>
        <button
          onClick={() => {
            setLoggedIn(false);
            setUsername("");
            setPassword("");
            setMessage("");
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">
        {page === "login" ? "Login" : "Register"}
      </h2>

      <input
        type="text"
        placeholder="Username"
        className="block w-full mb-2 p-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="block w-full mb-2 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {page === "login" ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleLogin}
        >
          Log In
        </button>
      ) : (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          onClick={handleRegister}
        >
          Register
        </button>
      )}

      {message && <p className="mt-3">{message}</p>}

      <p
        className="mt-4 text-sm text-blue-500 cursor-pointer"
        onClick={() => {
          setMessage("");
          setPage(page === "login" ? "register" : "login");
        }}
      >
        {page === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Log in"}
      </p>
    </div>
  );
}
