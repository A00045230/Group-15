"use client";

import { useState } from "react";
import users from "@/data/users.json";
import events from "@/data/events.json";
import { recommendEvents } from "@/lib/recommender";

export default function RecommendationsPage() {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  const selectedUser = users.find((u) => u.id === selectedUserId)!;
  const recommendations = recommendEvents(selectedUser, events);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Recommended Events
        </h1>

        {/* 👇 USER DROPDOWN */}
        <div className="mb-6">
          <label className="mr-2 font-medium text-gray-700">
            Select User:
          </label>
          <select
            className="rounded border p-2"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-6 text-gray-600">
          Recommendations for <strong>{selectedUser.name}</strong>
        </p>

        <div className="space-y-4">
          {recommendations.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {event.title}
              </h2>
              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Category:</span> {event.category}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p>
                  <span className="font-medium">Match Score:</span> {event.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}