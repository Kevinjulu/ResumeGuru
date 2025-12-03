import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function Account() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
              {user && (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span> {user.firstName}{" "}
                    {user.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {user.id}
                  </p>
                </div>
              )}
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Account Actions</h2>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
