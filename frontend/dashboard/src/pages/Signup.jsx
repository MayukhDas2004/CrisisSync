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
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
      });

      console.log("SUCCESS:", res.data);

      alert("Signup successful! Please login.");
      navigate("/");

    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE DATA:", err.response?.data);

      // 🔥 FIX: handle FastAPI error structure safely
      if (Array.isArray(err.response?.data?.detail)) {
        setError(err.response.data.detail[0]?.msg || "Validation error");
      } else if (typeof err.response?.data?.detail === "string") {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed. Backend error.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <br /><br />

        {/* ✅ Role selector (important) */}
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

      </form>

      {/* ✅ Safe error rendering */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Signup;
