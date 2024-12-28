'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name , number }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        className="mb-2 p-2 border"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="mb-2 p-2 border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Number"
        className="mb-2 p-2 border"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-2 p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Signup
      </button>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
