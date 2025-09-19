import React from "react";

function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key === "emailUpdates" && "Email Updates"}
                  {key === "collaborationRequests" && "Collaboration Requests"}
                  {key === "newFollowers" && "New Followers"}
                  {key === "weeklyDigest" && "Weekly Digest"}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === "emailUpdates" &&
                    "Receive email notifications for important updates"}
                  {key === "collaborationRequests" &&
                    "Get notified when someone wants to collaborate"}
                  {key === "newFollowers" &&
                    "Notifications when someone follows you"}
                  {key === "weeklyDigest" &&
                    "Weekly summary of your blog performance"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
