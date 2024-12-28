'use client';

import { useState } from "react";
import axios from "axios";

const UserTransferPage = () => {
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleTransfer = async () => {
    try {
      await axios.post("/api/transferwtu", {
        senderEmail,
        recipientEmail,
        amount,
      });
      alert("Transfer successful!");
    } catch (error) {
      alert("Error during transfer. Check your wallet balance.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Transfer to Another User</h2>
      <input
        type="text"
        placeholder="Your Email"
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      />
      <input
        type="text"
        placeholder="Recipient Email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        className="w-full p-2 border rounded-md mb-5"
      />
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

export default UserTransferPage;
