next section is the cart.
in my pos.json:
{"cart": {}}

- the title of the section: "Cart";
- the description of the section: "Review the items before checkout.";
- the first paragraph when the cart is empty : "Cart is empty";
- the second paragraph when the cart is empty: "Add dishes from the menu to start an order.";
- in the ul section that is rendered only when at leat one item is in the cart i have this aria-label:
aria-label="Selected items" not sure i should translate it;
- at the bottom of the page where the total èrice of all the cart is rendered : "Total";
- {itemCount === 1 ? "item" : "items"} in the top of the section i have this small pill that 
  render the total number of the items;

in each item card:
- on the button to increment the quantity of the item : aria-label={`Add one more one ${item.name}`}
- on the button to increment the quantity of the item : title: ""
- on the button to decrement the quantity of the item : aria-label={`Remove one ${item.name}`}
- on the button to decrement the quantity of the item : title=""