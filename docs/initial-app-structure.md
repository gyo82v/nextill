INITIAL APP STRUCTURE:

FEATURES:
- [Darkmode]
- [Languages]
- [Progressive-web-app] make it installable and add an icon;
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
- [Stock/categories] diplay items in the stock and its quantity;
- [Stock/add-item] the user can add item to the stock, with neam, quantity, category;
- [Reports/daily] display the statistic for the active  current day, total earning, total transactions,
                  an array of the daily transactions, items sold etc;
- [Reports/globals] display the statistic  of all time same as daily, not the array of all the transactions;
- [Reports/overview] display thtotla earnings and total number of transactions for each day, optionally 
                     clicking on each day will show the array of transactions for that day;
- [Account/options] the user can delete the account or reset the password;
- [Account/app-options] the user can reset the menu, stock and reports;


PAGES:
- [Homepage] display the available dishes, the cart and the order button;
- [Menu] manages the menu, add or remove dishes; add ingredients for each dish;
- [Stock] manages the stock, add or remove items from the stock, modify quantity of each
          existing item;
- [Reports] display data like quantity of each item sold, each day earning, totla earning etc..;
- [Account] display account information , delete account, reset pssw, reset menu, reset stock etc...;
- [Initial-page] diplay log in, sign-in, title, description etc..;


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
- [print-option] add a print option in the complete order page;
- [Custom-categories] give the user the option to create custom categories instead of the preset;
- [reports] add the best selling item per category;
- [Account] add additional palette colors
- [Icons] Create custom icon for the installable version;
- [feature] add the undo-last-sale option to be able to delete the most recent transaction;
- [feature] add low-stock warning for items in the stock page;
- [feature] search bar in the stock and menu page;

DECISIONS:
- [Server/client] which component servers and which client;
- [Homepage/order-confirmation] use a  modal or  a page for the order confirmation;