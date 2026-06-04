export default function AccountOverviewSection({user, profile}) {
    console.log("user :", user);
    return (
        <section>
          <h2>Profile</h2>
          <div className="grid gap-2 text-sm">
            <p><span className="font-medium">Email:</span> {profile?.email ?? "—"}</p>
            <p><span className="font-medium">Username:</span> {profile?.displayName}</p>
            <p>
              <span className="font-medium">Day status:</span>
              {profile?.nextillApp.dayCycle.active ? "Active" : "Inactive"}
            </p>
            <p>
              <span className="font-medium">Email confirmed:</span>
              {user?.emailVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Printing enabled:</span>
              {profile?.nextillApp.settings.printingEnabled ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Balance enabled:</span>
              {profile?.nextillApp.settings.balanceEnabled ? "Yes" : "No"}
            </p>
          </div>
        </section>
    )

}