import React, { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div>
      <h2>Signup</h2>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Sign Up</button>
    </div>
  );
}
