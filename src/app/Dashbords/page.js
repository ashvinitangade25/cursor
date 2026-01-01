"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import ApiKeysTable from "@/components/ApiKeysTable";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useApiKeys } from "@/hooks/useApiKeys";
import { generateApiKey } from "@/utils/apiKeyUtils";
import { copyToClipboard } from "@/utils/clipboard";

export default function DashboardsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  });

  // Use custom hook for API key operations
  const { apiKeys, loading, error, createApiKey, updateApiKey, deleteApiKey } =
    useApiKeys();

  const showToastMessage = useCallback((message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: "", type: "success" });
    }, 3000);
  }, []);

  const handleOpenModal = (key = null) => {
    if (key) {
      setEditingKey(key);
      setFormData({
        name: key.name,
        key: key.key,
        description: key.description || "",
      });
    } else {
      setEditingKey(null);
      setFormData({
        name: "",
        key: generateApiKey(),
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingKey(null);
    setFormData({
      name: "",
      key: "",
      description: "",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKey) {
        await updateApiKey(editingKey.id, formData);
        showToastMessage("API key updated successfully", "success");
      } else {
        await createApiKey(formData);
        showToastMessage("API key created successfully", "success");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving API key:", error);
      showToastMessage(
        "Failed to save API key: " + (error.message || "Unknown error"),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this API key?")) {
      try {
        await deleteApiKey(id);
        showToastMessage("API key deleted successfully", "error");
      } catch (error) {
        console.error("Error deleting API key:", error);
        showToastMessage(
          "Failed to delete API key: " + (error.message || "Unknown error"),
          "error"
        );
      }
    }
  };

  const handleCopyKey = async (keyValue) => {
    try {
      const success = await copyToClipboard(keyValue);
      if (success) {
        showToastMessage("Copied API Key to clipboard", "success");
      } else {
        showToastMessage("Failed to copy API key", "error");
      }
    } catch (error) {
      console.error("Error copying API key:", error);
      showToastMessage("Failed to copy API key", "error");
    }
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
                  <p className="text-sm text-gray-500">Pages / Overview</p>
                  <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                    Overview
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6">
          <div className="max-w-7xl mx-auto">
            {/* Toast Notification */}
            <Toast
              show={showToast.show}
              message={showToast.message}
              type={showToast.type}
              onClose={() =>
                setShowToast({ show: false, message: "", type: "success" })
              }
            />

            {/* API Keys Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  API Keys
                  <button
                    onClick={() => handleOpenModal()}
                    className="p-1.5 text-gray-500 hover:text-gray-700"
                    title="Create API Key"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The key is used to authenticate your requests to the Research
                API. To learn more, see the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Research API
                </a>{" "}
                or the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  documentation page
                </a>
                .
              </p>
            </div>

            {/* API Keys Table */}
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg">Loading API keys...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No API keys yet. Create your first one!
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  Create API Key
                </button>
              </div>
            ) : (
              <ApiKeysTable
                apiKeys={apiKeys}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onCopy={handleCopyKey}
              />
            )}

            {/* Modal for Create/Edit */}
            <ApiKeyModal
              isOpen={isModalOpen}
              editingKey={editingKey}
              formData={formData}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              onFormDataChange={setFormData}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
