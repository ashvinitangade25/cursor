"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";

export default function ProtectedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const router = useRouter();

  useEffect(() => {
    // Get API key from sessionStorage
    const storedApiKey = sessionStorage.getItem("apiKeyToValidate");

    if (!storedApiKey) {
      // No API key found, redirect back to API-Playground
      router.push("/API-Playground");
      return;
    }

    setApiKey(storedApiKey);
    validateApiKey(storedApiKey);
  }, [router]);

  const validateApiKey = async (keyToValidate) => {
    try {
      setIsValidating(true);

      // Query Supabase to check if the API key exists and is active
      const { data, error } = await supabase
        .from("api_keys")
        .select("id, name, status, key")
        .eq("key", keyToValidate)
        .eq("status", "active")
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - which is expected for invalid keys
        throw error;
      }

      if (data && data.status === "active") {
        // Valid API key
        setIsValid(true);
        setShowToast({
          show: true,
          message: "Valid API key, /protected can be accessed",
          type: "success",
        });

        // Clear the stored API key after successful validation
        sessionStorage.removeItem("apiKeyToValidate");
      } else {
        // Invalid API key
        setIsValid(false);
        setShowToast({
          show: true,
          message: "Invalid API key. Please check your key and try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsValid(false);
      setShowToast({
        show: true,
        message: "Error validating API key. Please try again.",
        type: "error",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleTryAgain = () => {
    sessionStorage.removeItem("apiKeyToValidate");
    router.push("/API-Playground");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        } flex-shrink-0 overflow-hidden`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Header Bar */}
        <div className="bg-green-500 h-1"></div>
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative flex-shrink-0">
          {/* Show Sidebar Button - Only visible when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-2.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 shadow-lg border border-gray-200"
              aria-label="Show sidebar"
              title="Show sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Link
                  href="/"
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Back to Home"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    Pages / Protected
                  </p>
                  <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1 truncate">
                    Protected Area
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Toast Notification */}
            <Toast
              show={showToast.show}
              message={showToast.message}
              type={showToast.type}
              onClose={() =>
                setShowToast({ show: false, message: "", type: "success" })
              }
            />

            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
              {isValidating ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Validating API Key
                  </h2>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : isValid ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Access Granted
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your API key is valid. You now have access to the protected
                    area.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-800">
                      <strong>Status:</strong> Valid API key, /protected can be
                      accessed
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/API-Playground"
                      className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                    >
                      Back to Playground
                    </Link>
                    <Link
                      href="/Dashbords"
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Access Denied
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The API key you provided is invalid or inactive.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> Invalid API key. Please check your
                      key and try again.
                    </p>
                  </div>
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
