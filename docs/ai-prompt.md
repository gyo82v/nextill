perfect. next and last section is the data management section.
here the user can delete or archieve the databsae data.
in the account.json => {"management": {all fileds in here}}

- the title of the section: ""Data management";
- the description of the section: "Permanently remove reports or archived data from the database.";

i have five rows:

clearReports: {
      title: "Clear reports / statistics",
      description: "Delete the reports and statistics data only.",
      buttonLabel:  "Clear reports",
      confirmLabel: "Clear reports",
      successMessage: "Reports cleared.",
    },
deleteArchivedItems: {
      title: "Delete all archived items",
      description: "Remove all archived menu and stock items permanently.",
      buttonLabel: "Delete archived items",
      confirmLabel: "Delete archived items",
      successMessage: "Archived items deleted.",
    },
deleteArchivedMenuItems: {
      title: "Delete archived menu items",
      description: "Remove only archived items from the menu list.",
      buttonLabel: "Delete menu archive",
      confirmLabel: "Delete menu archive",
      successMessage: "Archived menu items deleted.",
    },
deleteArchivedStockItems: {
      title: "Delete archived stock items",
      description: "Remove only archived items from the stock list.",
      buttonLabel: "Delete stock archive",
      confirmLabel: "Delete stock archive",
      successMessage: "Archived stock items deleted.",
    },
resetAllData: {
      title: "Delete all database data",
      description: "Permanently remove all data, including archived items.",
      buttonLabel: "Delete all data",
      confirmLabel: "Delete all data",
      successMessage: "All data deleted.",
    },


i have three subtitles:

- for the subsection that clears only the reports: "Reports"
- for the subsection that clean up only the archieved elements:  "Archived cleanup"
- for the subsectiion that clear everything: "Full reset"

also:
- tha cancel button label: "cancel"




as before if you have better alternative for the text please provide them otherwise keep my placeholder.
please include everything inside the "management" key