"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log("Attempting login with:", { username, password }); // Log credentials

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, { // URL with environment variable
        method: "POST", // Changed to POST
        headers: {
          "Content-Type": "application/json", // Set Content-Type header
        },
        body: JSON.stringify({ username, password }), // Send data in the body
      });

      console.log("Login API Response Status:", response.status); // Log status
      console.log("Login API Response Headers:", Object.fromEntries(response.headers.entries())); // Log headers

      const responseBodyText = await response.text(); // Get body as text first
      console.log("Login API Response Body (Text):", responseBodyText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseBodyText); // Try to parse as JSON
          setError(errorData.message || `Login failed with status: ${response.status}`);
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
          setError(responseBodyText || `Login failed with status: ${response.status}.`);
        }
        return;
      }

      try {
        const data = JSON.parse(responseBodyText); // Try to parse success response as JSON
        // Assuming the API returns a token
        if (data && data.token) {
          localStorage.setItem("authToken", data.token);
          console.log("Token stored, redirecting to dashboard.");
          router.push("/dashboard"); // Redirect to dashboard
        } else {
          console.warn("Token not found in response data:", data);
          setError("Login successful, but no token received from server.");
        }
      } catch (parseError) {
        console.error("Failed to parse success response as JSON:", parseError);
        setError("Received an invalid response from the server.");
      }
    } catch (err) {
      console.error("Login API call failed (Network or other error):", err);
      setError("An error occurred while trying to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
