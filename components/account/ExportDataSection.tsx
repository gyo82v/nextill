import Button from "@/components/ui/Button";

export default function ExportDataSection({handleExportData, exportLoading }){
    return(
        <section>
            <h2 className="text-lg font-medium">Export data</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExportData}
              disabled={exportLoading}
              loading={exportLoading}
              loadingText="Exporting"
            >
              Download Backup
            </Button>
        </section>
    )

}