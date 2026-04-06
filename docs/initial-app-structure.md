INITIAL APP STRUCTURE:


FEATURES:
- [Darkmode]
- [Languages]
- [Users] one account with pssw and username. Multiple users?
- [start/end-day] in the homepage the till will be available only when the 
                  day is active
- [Homepage/till] the user can add or remove items to the cart. Click an order button will trigger
                  the modal/page to complete the order;
- [Homepage/complete-order] it will display the items in the cart, the total cost amout, 
                            the back button and the confirmation button. whan the confirmation button is clicked the order is complete;
- [Menu/categories] diplay the current dishes on the menu in each category;
- [Menu/add-dish] the user can add a dish to the menu, it can choose the name, price, cetegories and 
                  ingredients from the one available in the stock; 



PAGES:
- [Homepage] display the available dishes, the cart and the order button;
- [Menu] manages the menu, add or remove dishes; add ingredients for each dish;
- [Stock] manages the stock, add or remove items from the stock, modify quantity of each
          existing item;
- [Reports] display data like quantity of each item sold, each day earning, totla earning etc..;
- [Account] display account information , delete account, reset pssw, reset menu, reset stock etc...;



STYLE:
- [Fonts]
- [Colors-palette]
- [Focus/transaction] create a styles folder, add a pattern file and create global transactions and 
                      focus reusable styles;

GLOBAL COMPONENTS:
- [Dividers]
- [Spinners]

COMPONENTS:
- [Dish-card] dhis  card diplayed in the homepage and menu pages in the categories sections;
- [Ingredients-card] ingredients card diplayed in the stock page;


EXTRA:
- [print-option]
- [Custom-categories] give the user the option to create custom categories instead of the preset;

DECISIONS:
- [Server/client] which component servers and which client;
- [Homepage/order-confirmation] use a  modal or  a page for the order confirmation;