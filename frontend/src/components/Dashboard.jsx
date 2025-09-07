// frontend/src/components/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-6">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Authentication is working! You are successfully logged in.
          </p>

          <h3 className="text-lg font-medium mb-4">User Information</h3>
          <dl className="flex flex-col md:flex-row gap-10">
            <div className="">
              <dt className="text-sm font-medium text-gray-500">Username:</dt>
              <dd className="text-sm text-gray-900">{user?.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Display Name:
              </dt>
              <dd className="text-sm text-gray-900">
                {user?.display_name || "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email:</dt>
              <dd className="text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Member Since:
              </dt>
              <dd className="text-sm text-gray-900">
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleDateString()
                  : "Unknown"}
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}