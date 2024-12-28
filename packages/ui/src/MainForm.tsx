// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// type User = {
//   id: number;
//   email: string;
//   name: string | null;
// };

// export default function MainPage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         console.log("Going in protected");

//         const res = await axios.get("/api/proctected", {
//           withCredentials: true, // Ensure cookies are sent with the request
//           headers: {"Cookie": document.cookie}
//         });

//         setUser(res.data.user);
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           console.error("Access denied");
//           router.push("/login");
//         } else {
//           console.error("Error fetching user:", error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [router]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
//       <p className="text-xl">Name: {user?.name || "Anonymous"}</p>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


type User = {
  id: number;
  email: string;
  name: string | null;
};

export default function MainPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("wallet"); // Default page: 'wallet'
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user details from /api/protected");

        const res = await axios.get("/api/protected", {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: { Cookie: document.cookie },
        });

        setUser(res.data.user);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error("Access denied");
          router.push("/login");
        } else {
          console.error("Error fetching user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <div>Loading...</div>;
// Handle page rendering based on currentPage
const renderPage = () => {
  switch (currentPage) {
    case "wallet":
      return <WalletPage />;
    case "user-transfer":
      return <UserTransferPage />;
    case "history":
      return <HistoryPage />;
    case "balance":
      return <BalancePage />;
    default:
      return <WalletPage />;
  }
};

return (
  <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar setCurrentPage={setCurrentPage} router={router} />
    <div className="w-full">
      {/* AppBar */}
      <AppBar
        userName={user?.name || "Anonymous"}
        userEmail={user?.email || ""}
      />
      <div className="p-5">{renderPage()}</div>
    </div>
  </div>
);
}

// Sidebar Component
const Sidebar = ({
setCurrentPage,
router,
}: {
setCurrentPage: (page: string) => void;
router: any;
}) => (
<div className="w-64 bg-gray-800 text-white p-4">
  <button
    onClick={() => router.push("/wallet")}
    className="block mb-2 p-2 bg-blue-500 rounded"
  >
    Wallet
  </button>
  <button
    onClick={() => router.push("/user-transfer")}
    className="block mb-2 p-2 bg-blue-500 rounded"
  >
    User Transfer
  </button>
  <button
    onClick={() => router.push("/history")}
    className="block mb-2 p-2 bg-blue-500 rounded"
  >
    History
  </button>
  <button
    onClick={() => router.push("/balance")}
    className="block mb-2 p-2 bg-blue-500 rounded"
  >
    Balance
  </button>
</div>
);

// AppBar Component
const AppBar = ({
userName,
userEmail,
}: {
userName: string;
userEmail: string;
}) => (
<div className="bg-gray-900 text-white p-4">
  <p>Welcome, {userName}</p>
  <p>{userEmail}</p>
</div>
);

// WalletPage Component
const WalletPage = () => {
return (
  <div>
    <h2 className="text-2xl font-bold mb-5">Wallet Page</h2>
    <p>This is the Wallet page content.</p>
  </div>
);
};

// UserTransferPage Component
const UserTransferPage = () => {
return (
  <div>
    <h2 className="text-2xl font-bold mb-5">User Transfer Page</h2>
    <p>This is the User Transfer page content.</p>
  </div>
);
};

// HistoryPage Component
const HistoryPage = () => {
return (
  <div>
    <h2 className="text-2xl font-bold mb-5">History Page</h2>
    <p>This is the History page content.</p>
  </div>
);
};

// BalancePage Component
const BalancePage = () => {
return (
  <div>
    <h2 className="text-2xl font-bold mb-5">Balance Page</h2>
    <p>This is the Balance page content.</p>
  </div>
);
};