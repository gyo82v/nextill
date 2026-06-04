import Button from "@/components/ui/Button";

export default function SecuritySection({handleResetPassword, handleDeleteAccount, actionLoading, dayActive, deletePassword, setDeletePassword}){
    return(
        <section>
          <h2 className="text-lg font-medium">Security</h2>
          <div className="space-y-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetPassword}
            >
                Reset password
            </Button>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Delete account</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <Button
                type="button"
                onClick={handleDeleteAccount}
                disabled={actionLoading || dayActive}
                variant="danger"
              >
                Delete account
              </Button>
              {dayActive ? (
                <p className="text-xs text-orange-600">
                  End the day before deleting the account.
                </p>
              ) : null}
            </div>
          </div>
        </section>
    )
}