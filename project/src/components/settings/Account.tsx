import { AlertTriangle, Trash2 } from "lucide-react";

function Account() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danger Zone
        </h3>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-2">
                Delete Account
              </h4>
              <p className="text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be
                certain. All your posts, comments, and data will be permanently
                removed.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
