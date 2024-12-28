'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page(): JSX.Element {
  const router = useRouter();

  // Redirect to login page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer
  }, [router]);

  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300/30 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
      </div>

      {/* Landing Page Content */}
      <div className="z-10 text-center text-white">
        <h1 className="text-6xl font-extrabold animate-fade-in-down">
          Welcome to Our App
        </h1>
        <p className="text-lg mt-4 animate-fade-in-up">
          Your journey starts here. Redirecting you to login...
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
