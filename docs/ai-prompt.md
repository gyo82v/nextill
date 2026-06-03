perfect: next section is the menu list section where all the available menu items
are rendered divided in category section.
my pos.json:
{menu:{}}

- the section title: "Menu";
- the section description: "Tap a dish to add it to the cart.";
each category title:
- food section: "Food";
- drinks section: "drinks";
- combo section: "Combo" not sure if plural is Comboes or somthing else;
- dessrts section: "Desserts";

each category description:
- food section: "Meals, mains, and anything savory.";
- drinks section: "Soft drinks, water, coffee, and more."
- combo section: "Food and drinks sold together.";
- dessert section: "Sweet treats and desserts.";

in the header of each section i have the number of items in it:
{sectionItems.length} items
i need the singular/plural for this
please provide also the code i have to use inside the component instead of
{sectionItems.length} items

each menu item card:these are button elements;

- the aria-label: aria-label={`Add ${item.name} to cart`}
- text in the bottom: "Tap to add"
