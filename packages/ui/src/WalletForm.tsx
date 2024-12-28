'use client';

import { useState } from "react";
import axios from "axios";

const WalletPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [transferType, setTransferType] = useState<string>("bank-to-wallet");
  const [email, setEmail] = useState<string>(""); // User email

  const handleTransfer = async () => {
    try {
      const endpoint =
        transferType === "bank-to-wallet"
          ? "/api/transferbtw"
          : "/api/transferwtb";
        console.log("Going in api of endpoint - "+endpoint);
      await axios.post(endpoint, { email, amount });
      alert("Transfer successful!");
    } catch (error) {
      alert("Error during transfer. Check your balance.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Wallet Transfers</h2>
      <input
        type="text"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      />
      <select
        value={transferType}
        onChange={(e) => setTransferType(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      >
        <option value="bank-to-wallet">Bank to Wallet</option>
        <option value="wallet-to-bank">Wallet to Bank</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 border rounded-md mb-5"
      />
      <button
        onClick={handleTransfer}
        className="w-full bg-blue-600 text-white py-2 rounded-md"
      >
        Transfer
      </button>
    </div>
  );
};

export default WalletPage;
