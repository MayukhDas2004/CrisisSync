import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        username: form.username.trim(),
        password: form.password
      });

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      // 🔍 FULL DEBUG LOGS
      console.log("FULL ERROR:", err);
      console.log(
        "RESPONSE DATA:",
        JSON.stringify(err.response?.data, null, 2)
      );

      // 🧠 SAFE ERROR PARSING (NO MORE CRASH)
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
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* ✅ SAFE RENDER (string only) */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Signup;
