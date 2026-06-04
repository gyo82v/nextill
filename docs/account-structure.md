1. Account overview

This should be the first section, because it gives the user immediate context.

Include:

email
username
day active status
email confirmed
enabled systems summary

This section should feel like a compact “profile card” or “account summary”.

2. Preferences

Put all non-destructive personal settings together.

Include:

language
currency
accessibility: disable motion
ticket printing on/off
start/end balance system on/off

These are the settings users are most likely to change often, so they should be easy to find.

3. Account security

Keep security actions separate from general preferences.

Include:

password reset
delete account with password
change/add another email

About the email change/add option: I would only keep it if it clearly supports your auth flow.
If your app already uses one primary email and there is no strong need for multiple emails, it may be simpler to leave this out for now. For most apps, changing the main email is useful; adding another email is usually unnecessary unless you support recovery or multi-login workflows.

4. Data export

This should be a standalone section.

Include:

export data download

Even if the feature is not implemented yet, keeping it separate makes sense because it is a user-rights/data-portability action.

5. Data management

This is where the destructive database actions go.

Include:

clear only reports data
delete all archived data
clear everything: menu, stock, reports

This section should be visually separated and placed lower on the page because these actions are dangerous.

6. Legal

Put this at the bottom.

Include:

privacy policy link

That is the least interactive part of the page, so it belongs last.