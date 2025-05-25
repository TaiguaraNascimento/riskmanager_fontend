"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Attempt to call the logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Log an error if the API call fails, but proceed with client-side logout
        console.error("Logout API call failed:", response.statusText);
        const errorData = await response.json().catch(() => null); // Try to get error message
        if (errorData && errorData.message) {
            console.error("API Error Message:", errorData.message);
        }
      }
    } catch (error) {
      // Log any network or other errors during the API call, but proceed
      console.error("Error during logout API call:", error);
    } finally {
      // Always clear client-side authentication data and redirect
      localStorage.removeItem("authToken");
      router.push("/login");
      // No need to setIsLoading(false) as the component will unmount or page will change
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/placeholder-logo.svg"
            alt="App Logo"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-semibold">v0 App</h1>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoading}
          className="text-gray-800 bg-white hover:bg-gray-200 disabled:opacity-50"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}
