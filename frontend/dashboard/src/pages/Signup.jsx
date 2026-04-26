import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
      });

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(
        "RESPONSE DATA:",
        JSON.stringify(err.response?.data, null, 2)
      );

      let message = "Signup failed";

      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          message = err.response.data.detail
            .map((e) => e.msg)
            .join(", ");
        } else {
          message = err.response.data.detail;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {/* Optional: role selector */}
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Signup;
