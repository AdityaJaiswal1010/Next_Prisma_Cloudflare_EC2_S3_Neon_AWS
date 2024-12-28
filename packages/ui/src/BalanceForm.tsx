'use client';

import { useState } from "react";
import axios from "axios";

const BalancePage = () => {
  const [email, setEmail] = useState<string>("");
  const [balances, setBalances] = useState<any>(null);

  const fetchBalances = async () => {
    try {
      const response = await axios.get("/api/balance",{ params: { email }, });
      setBalances(response.data);
    } catch (error) {
      alert("Error fetching balance.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">User Balance</h2>
      <input
        type="text"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      />
      <button
        onClick={fetchBalances}
        className="w-full bg-blue-600 text-white py-2 rounded-md mb-5"
      >
        Check Balance
      </button>
      {balances && (
        <div>
          <p>Wallet Balance: {balances.locked}</p>
          <p>Bank Balance: {balances.amount}</p>
        </div>
      )}
    </div>
  );
};

export default BalancePage;
