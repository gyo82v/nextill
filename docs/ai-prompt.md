perfect; next section is the modal that opens when the user clicks
the checkout button; it recap the order and allow the user to complete it.
this modal have a success state when the order is completed;
in my pos.json:
{"modal":{
  keys here
  "success": {
    keys here
  }
}}


before complete the order state:
- title: "Complete order";
- description: "Review the order summary before finalizing the sale.";





success state:
- title: "Order completed";
- description when printing is enabled: "The sale was completed successfully.";
- description when printing is disabled: "The sale was completed and saved.";
- button text for printing the ticket for the staff: "Print staff ticket";
- button text for printing the receipt for the customer: "Print receipt";
- button text for going back to the pos page: "New order";
- text that is rendered when the printing is disabled; in this case the modal 
  will disappear automatically after a second: "Returning to POS...";

