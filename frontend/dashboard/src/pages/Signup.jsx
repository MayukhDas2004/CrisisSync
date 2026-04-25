import React, { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <br />

      <button>Sign Up</button>
    </div>
  );
}
