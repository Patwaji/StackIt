"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Edit,
  Shield,
  UserX,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { userDetailsUrl } from "@/lib/API";

const toast = {
  error: (message) => console.error(`Toast Error: ${message}`),
};

export default function ProfilePage({ isAdmin = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserDetails = async (authToken) => {
      try {
        const res = await fetch(userDetailsUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Unable to load user info.");
        toast.error("Unable to load user info.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails(token);
    } else {
      setLoading(false);
      setError("No authentication token provided.");
      toast.error("You are not logged in.");
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto p-8 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">User not found.</div>
    );
  }

  const ProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Bio</h3>
        <p className="text-muted-foreground">{user.bio}</p>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="w-4 h-4 mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            Joined{" "}
            {new Date(user.joined).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-card p-6 rounded-lg border mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-primary"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="flex justify-center sm:justify-start flex-wrap gap-x-6 gap-y-2 mt-4"></div>
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </button>
        </div>

        {isAdmin && isLoggedIn && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" /> Admin Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1.5 rounded-md">
                <UserX className="w-4 h-4 mr-2" /> Suspend User
              </button>
              <button className="inline-flex items-center text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md">
                <KeyRound className="w-4 h-4 mr-2" /> Reset Password
              </button>
              <button className="inline-flex items-center text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md">
                <UserCheck className="w-4 h-4 mr-2" /> Make Admin
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="border-b mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("profile")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "questions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setActiveTab("answers")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "answers"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Answers
            </button>
          </nav>
        </div>

        <div>
          {activeTab === "profile" && <ProfileTab />}
          {/* {activeTab === "questions" && <QuestionsTab />}
          {activeTab === "answers" && <AnswersTab />} */}
        </div>
      </div>
    </main>
  );
}
