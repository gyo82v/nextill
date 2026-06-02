next step is the start day section.
this will be rendered instead of the normal pos page when the day is 
not active and will allow the user to start the day and set the starting balance;
in my pos.json i will have all these keys in here:
{
    "startDay": {}
}

- title "Start day" this is a placeholder not sure what to use as title;
- description under the title: "The POS is not available yet because the day has not been started.
                                Start the day to unlock the point of sale and begin working."
- title in the balance section: "Opening balance";
- description in the balance section: "Enter the cash you are starting with today. This amount will be used  as the opening balance for the day.";
- paragraph under the input field: "If you do not need an opening balance, you can disable it from the Account page."
- button: "start day"
- button loading text: "Starting"
- description when the balance is not enabled: "Opening balance is disabled for this account. You can enable it from the Account page if you need it."
- error message when the user does not enter a balance when is enabled: "Enter a valid opening balance."


some of these are already good but please improve any if necessary
