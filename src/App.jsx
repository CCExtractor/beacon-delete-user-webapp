import { useState } from "react";
import axios from "axios";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    console.log("login", email, password);
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const response = await axios.post(
        "https://beacon-backend-25.onrender.com/graphql",
        {
          query: `
          mutation {
              login(credentials: {
              email: "${email}",
              password: "${password}"
            })
          }
        `,
        }
      );

      console.log("response", response.data);
      const userToken = response.data.data?.login;
      if (userToken) {
        setToken(userToken);
        setMessage("Login successful. You can now delete your account.");
      } else {
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMessage(error.response?.data?.errors?.[0]?.message || "Login error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    console.log("token", token);
    setMessage("Deleting account...");
    try {
      const response = await axios.post(
        "https://beacon-backend-25.onrender.com/graphql",
        {
          query: `
            mutation {
              deleteUser(credentials: { email: "${email}", password: "${password}" })
            }
          `,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data?.deleteUser) {
        setMessage("Account deleted successfully.");
      } else {
        setMessage("Account deletion failed.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.errors?.[0]?.message || "Deletion error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          Delete Account
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email and password to log in and delete your account
          permanently.
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Log In
          </button>
        </form>

        {/* Delete Button (only enabled if logged in) */}
        <form onSubmit={handleDelete} className="mt-4">
          <button
            type="submit"
            disabled={!token}
            className={`w-full py-2 rounded ${
              token
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete Account
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p className="text-center mt-2 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
