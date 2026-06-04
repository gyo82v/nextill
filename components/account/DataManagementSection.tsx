import Button from "../ui/Button"

export default function DataManagementSection({dayActive, actionLoading, resetData}){
    return(
        <section>
            <h2 className="text-lg font-medium">Data management</h2>
            {dayActive ? (
          <p className="text-sm text-orange-600">
            Destructive actions are disabled while a day is active.
          </p>
        ) : null}
        <div>
            <Button
              type="button"
              variant="danger"
              disabled={actionLoading || dayActive}
              loading={actionLoading}
              onClick={resetData}
            >
                Reset all data
            </Button>



        </div>
        </section>
    )
}