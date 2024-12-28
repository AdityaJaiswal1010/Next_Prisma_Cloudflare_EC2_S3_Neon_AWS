'use client';


import { useEffect, useState } from "react";
import axios from "axios";

const HistoryPage = () => {
  const [email, setEmail] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/api/transactions",{params: {email}});
      setTransactions(response.data);
    } catch (error) {
      alert("Error fetching history.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Transaction History</h2>
      <input
        type="text"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      />
      <button
        onClick={fetchHistory}
        className="w-full bg-blue-600 text-white py-2 rounded-md mb-5"
      >
        View History
      </button>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index} className="mb-3 border p-3 rounded-md">
            {transaction.type}: {transaction.amount} (Status:{" "}
            {transaction.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPage;
