"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

const PROTECTED_ROUTES = ["/", "/dashboard"]; // Root and dashboard are protected
const PUBLIC_ROUTES = ["/login", "/register"]; // Explicitly public routes

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This effect runs when the component mounts or pathname changes
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, [pathname]); // Re-check authentication status on route change

  const isProtectedRoutePage = PROTECTED_ROUTES.includes(pathname) || 
                               !PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // This effect handles redirection based on authentication status
    if (!isLoading) {
      if (!isAuthenticated && isProtectedRoutePage) {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, isProtectedRoutePage, router]); // router and pathname (via isProtectedRoutePage) are dependencies

  if (isLoading || (!isAuthenticated && isProtectedRoutePage)) {
    // Show loading indicator while checking auth or if user is unauthenticated on a protected page (before redirect happens)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  // If authenticated or on a public route (which wouldn't be caught by the condition above), render children.
  return <>{children}</>;
}
