import { AlertTriangle, Trash2 } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import useDeleteAccount from "../../hooks/accountHooks/useDeleteAccount";

function Account() {
  const { showDeleteConfirm, setShowDeleteConfirm } = useSettings();
  const { deleteAccount } = useDeleteAccount();

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  return (
    <>
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
                  Once you delete your account, there is no going back. Please
                  be certain. All your posts, comments, and data will be
                  permanently removed.
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
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Account Deletion
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
