"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

export default function DocumentationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <header className="bg-white border-b border-gray-200 px-6 py-4 relative">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
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
                <div>
                  <p className="text-sm text-gray-500">Pages / Documentation</p>
                  <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                    Documentation
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                  Documentation
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6 text-center">
                    Welcome to the Research API documentation. Here you'll find all the information you need to get started.
                  </p>
                  
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Getting Started
                      </h3>
                      <p className="text-gray-600 mb-4">
                        To get started with the Research API, you'll need to create an API key from the Overview page. Once you have your API key, you can use it to authenticate your requests.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        API Endpoints
                      </h3>
                      <p className="text-gray-600 mb-4">
                        The Research API provides several endpoints for conducting research, generating reports, and managing your data. Visit the API Playground to test different endpoints.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Authentication
                      </h3>
                      <p className="text-gray-600 mb-4">
                        All API requests require authentication using your API key. Include your API key in the Authorization header:
                      </p>
                      <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                        <code>Authorization: Bearer YOUR_API_KEY</code>
                      </pre>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Rate Limits
                      </h3>
                      <p className="text-gray-600 mb-4">
                        API requests are rate-limited to ensure fair usage. Check your usage statistics in the Overview page to monitor your API usage.
                      </p>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
