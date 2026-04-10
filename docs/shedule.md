1️⃣ App skeleton + route protection (FIRST)

Why first:
If auth and routing aren’t locked in early, you’ll keep refactoring later.

What to build now:

App Router structure (/login, /register, /app/...)
Public auth layout (login / create account)
Protected app layout
Server-side auth check (read token → allow/redirect)
Loading states

At the end of this step:

Unauthenticated users cannot access app pages
Logged-in users never see the login page again

This is the backbone of the app.

2️⃣ Global app shell (layout, header, navigation)

Why now:
Every page will use this, and it defines UX consistency.

Build:

Header
Navigation (menu / stock / till / stats / account)
Dark mode toggle
Language toggle
App title + branding

No business logic yet — just structure.

3️⃣ App settings plumbing (theme, language, day state)

Why before features:
These settings affect how pages render.

Implement:

Read settings from user.nextillApp.settings
Persist theme + language
Make them available everywhere
Read dayActive globally

After this:

The app reacts correctly to theme/language
You can safely hide/disable features based on day state

4️⃣ Firestore subcollections (foundation data)

Why before UI-heavy pages:
This defines what everything else depends on.

Set up:

stock subcollection
dishes subcollection
dailySummaries
transactions

Only basic CRUD + types — no UI yet.

5️⃣ Day cycle logic (CRITICAL)

Why now:
It controls whether the till works or not.

Build:

Start day
End day
Create daily summary
Lock/unlock till

This gives your app a real operational flow.

6️⃣ Stock manager

Why first feature:
Everything depends on stock.

Build:

Add / remove stock
Categories
Quantity updates
Low-stock warnings (optional)

7️⃣ Menu manager

Why after stock:
Menu items depend on stock items.

Build:

Create dishes
Assign ingredients
Disable unavailable dishes
Categories

8️⃣ Till / homepage (CORE FEATURE)

Why now:
Now all dependencies exist.

Build:

Add to cart
Checkout
Write transaction
Update stock
Update daily summary
Update global stats

This is the heart of the app.

9️⃣ Statistics page

Why later:
It’s read-only and depends on data already produced.

Build:

Totals
Daily summaries
Simple charts
Filters by date

🔟 Account & destructive actions (LAST)

Why last:
These are dangerous and touch everything.

Build:

Change password
Delete account
Clear app data
Reset day / stats

1️⃣1️⃣ PWA polish (final)

Why last:
Only worth doing once the app is stable.

Add:

Manifest
Icons
Installability
Meta tags

No offline yet — perfect.