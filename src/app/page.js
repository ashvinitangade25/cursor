"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const features = [
    {
      name: "Overview",
      description: "Manage your API keys and monitor usage statistics",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: "/Dashbords",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Research Assistant",
      description:
        "AI-powered research assistant to help you conduct research and analyze data",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      path: "/Research-Assistant",
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Research Reports",
      description: "View and manage all your generated research reports",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      path: "/Research-Reports",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "API Playground",
      description: "Test and experiment with the Research API endpoints",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 16l4-4-4-4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      path: "/API-Playground",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Invoices",
      description: "View billing information and payment history",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      path: "/Invoices",
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Documentation",
      description: "Complete API documentation and guides",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      path: "/Documentation",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <div className="h-screen bg-white flex overflow-hidden">
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
        {/* Top Header Bar */}
        <div className="bg-green-500 h-1 flex-shrink-0"></div>
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative flex-shrink-0">
          {/* Show Sidebar Button - Only visible when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-2.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 shadow-lg border border-gray-200"
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
          <div
            className={`flex items-center justify-between w-full ${
              !sidebarOpen ? "pl-12 sm:pl-16" : ""
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Home</p>
                  <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
                    Welcome to Cursor AI
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="hidden sm:inline">Operational</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Hero Section */}
            <div className="mb-8 sm:mb-12">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                  Research API Platform
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                  A comprehensive platform for managing API keys, conducting
                  research, generating reports, and testing your API endpoints.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.path}
                  className="group bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`${feature.color} p-2 sm:p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-purple-600 font-medium group-hover:gap-2 transition-all">
                        <span>Explore</span>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Platform Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                      API Keys
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Manage and secure your API keys with ease
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                      Research Tools
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    AI-powered research and analysis capabilities
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                      API Testing
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Test endpoints in real-time with the playground
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-8 sm:mt-12 text-center pb-4 sm:pb-6">
              <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  Ready to get started?
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                  Create your first API key and start exploring all the features
                  of the Research API platform.
                </p>
                <Link
                  href="/Dashbords"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-900 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
