Step 0 – Freeze behavior, focus only on UX

Rule:
Before touching layout or visuals, decide that:

No database logic changes
No breaking changes to order flow
Only UI, structure, and presentation

This keeps risk low on the most critical page of the app.

Step 1 – Define the POS mental model (no code yet)

Before coding, clearly decide:

Primary task: add items → review cart → checkout
Secondary tasks: print, end day
Dangerous task: end day

Everything we do later must reinforce this hierarchy.

If something does not help selling faster → it becomes secondary or hidden.

Step 2 – Restructure the dishes list (Point 1)

Goal: improve scanning speed without adding friction.

Actions:

Introduce a category concept in UI only (even if the data already has it).
Group dishes by category visually:
Section headers (Food, Drinks, etc.) or
Top category tabs/chips that filter the list.
Do not paginate or add search yet unless the list is large.

👉 This step improves speed immediately and does not affect cart logic.

Step 3 – Lock desktop layout first (Point 2 – desktop)

Desktop (lg+) should be solved first, because it’s the easiest and most stable.

Actions:

Create a fixed two-column layout:
Left: dishes (scrollable)
Right: cart (sticky or fixed height)
Ensure:
Cart total and checkout button are always visible
Dish list scroll does not move the cart

👉 This reduces cognitive load and increases confidence while selling.

Step 4 – Fix mobile flow (Point 2 – mobile)

Only after desktop feels solid.

Actions:

Switch to single column layout.
Hide the cart by default.
Add a sticky cart button (top or bottom) showing:
number of items
total price
Cart opens as:
slide-over panel or
bottom sheet

👉 This preserves speed without crowding the screen.

Step 5 – Enhance dish cards minimally (Point 4)

Now that structure is clear, improve recognition.

Actions:

Add one extra cue only:
category label or icon
Keep:
name as primary
price bold and clear
Avoid:
long descriptions
images (unless absolutely needed)

👉 Faster recognition = fewer mistakes.

Step 6 – Introduce checkout confirmation (Point 5)

This is the most sensitive step.

Actions:

Replace “instant checkout” with:
checkout button → confirmation modal
Modal contains:
item list
quantities
total
Buttons:
Confirm order (primary)
Cancel (secondary)

Important:
Do NOT change routes yet. Stay on the same page.

👉 This adds safety without slowing expert users.

Step 7 – Add printing at the correct moment (Point 6)

Printing belongs after confirmation, not before.

Actions:

After successful order:
show success state
Provide:
Print ticket
New order
Printing must be optional and fast.

👉 This matches real POS workflows.

Step 8 – Isolate “End of day” (Point 3)

Only do this after checkout is perfect.

Actions:

Move “End of day”:
out of the cart
out of the main flow
Add:
warning style
confirmation modal
Make it visually distinct from selling actions.

👉 Prevents catastrophic mistakes.

Step 9 – Add minimal titles & microcopy (Point 7)

Do this last so text matches the final layout.

Actions:

Add one page title only.
Optional small section headers:
Menu
Cart
No long descriptions.

👉 The UI should explain itself.