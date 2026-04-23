NEXTILL IMPLEMENTATION LIST

- [Design] [Header] Design the nextill logo;
- [Content] [App] Make the app Progressive  web App, add a manifest file, icons, html etc;
- [Design] [App] Design the icon app used when the app is installed;
- [Refactor] [Firestore] Modify the create new account function to add email confirmation;
- [Content] [Header] build the navigation bar for mobile, add icon, when clicked open the 
                     navigation menu;
- [Content] [Menu] Add the feature in the Menu page to clear all menu with a button;
- [Content] [Stock] Add the feature in the Stock page to clear all stock with a button;
- [Content] [Stats] Add a feature in the Stats page to clear all stats with a button;
- [Style] [Header] style the mobile navigation menu;
- [Content] [Till] create a confirm order modal/page; when the user clicks on the checkout button
                   the modal/page opens; it has a recap of the order, buttons to proceed or cancel;
                   option to print the ticket;
- [Content] [Till] implement the printing option in the confirmation modal/page, when the user clicks 
                   and complete the order if the print option is on it will open the browser print page and 
                   if possible print automatically;
- [Content] [Till] create the ticket component that will have the items bought, name, price, quantity,
                   separate in section drinks and food;
- [✅] {Refactor}{Header} modify the darkmode toggle to use icons instead of text, add accessibility
                      and decide if while in logged in mode it should be in the Header or Account page;
- [✅] {Refactor}{Header} Remove the language toggle from the Header in logged in mode;
- [Style] [Header] Style the Header for mobile/desktop in logged in/off mode;
- [Style] [Header] Style the navigation bar for desktop;
- [Style] [Header] Style the sign out button and the username;
- [Content] [Header] Add a confirmation modal when the user clicks the sign out button;
- [Style] [Header] Style the language and darkmode toggles in the header in logged off mode;
- [Content] [Footer] Add information in the footer like: project-demo, @nextill, a mail option etc;
- [Style] [footer] Style the footer for mobile/desktop;
- [Content] [Intro] add an introduction description in the intro page with h1, p ... it should 
                    describe what this app does, welcome the user, that is a free app, add more 
                    content in the desktop version;
- [Style] [Intro] Style the sign in form component;
- [style] [Intro] Style the create new account form component;
- [Fix] [Till] fix a visual bug, when a user sign in and the day is not active the till page 
               should immediately render the not active section and not briefly the active section;
- [Style] [Till] Style the till page while the day is not active;
- [Content] [Till] Add a description in the till page while the day is not active;
- [Style] [Till] Style the item card element;
- [Style] [Till] Style the till page so that the items are divided into sections: food and drinks;
- [Style] [Till] Style the cart section of the till page;
- [Style] [Till] Style the end day section in the till page;
- [Style] [Till] Style the Till page and the layout of the page for mobile/desktops;
- [Content] [Till] Add a title and brief description in the till page;
- [Content] [Menu] Add a title and a brief description in the menu page;
- [Style] [Menu] Style the add new item in the menu form component;
- [Style] [Menu] Style the current menu list section;
- [Style] [Menu] Style the menu page and layout for desktop/mobile;
- [Fix] [App] Fix the bug where some currency(usd) do not render the symbol but the text;
- [Style] [Stock] Style the add new item to the stock form in the stock page;
- [Style] [Stock] Style the current stock items list, search bar and filters in the current items 
                  section in the stock page;
- [Style] [Stock] Style the stock activity section in the stock page;
- [Style] [Stock] Style the page and layout for mobile/desktop;
- [Style] [Stock] Style the items card, style each different state : normal, low stock and negative;
- [Content] [Stock] Add a title and description in the stock page;
- [Style] [Stats] Style the global section of the stats page;
- [Style] [Stats] Style the current day section in the stats page;
- [Style] [Stats] Style the days overview section in the Stats page;
- [Style] [Stats] Style the Stats page and layout for mobile/desktop;
- [Content] [Stats] Add a title and description to the stats page and for each section;
- [Style] [Stats] Style the current day transactions section and each transaction card;
- [Style] [Stats] Style the daily overview cards;
- [Style] [Account] Style the account page and the layout for mobile/desktop;
- [Style] [Account] Style each section in the account page: profile,security,export data,
                    preferences and mantainance;
- [Style] [Account] Style the modal section when the user try to clear all data;
- [✅] {Refactor}{App} Refactor the language feature to support spanish, french and german;
- [Refactor] [Intro] Refactor the intro page: types, enslint errors, separate components;
- [Refactor] [Till] Refactor the Till page: types, enslint errors, separate components;
- [Refactor] [Menu] Refactor the Menu page: types, enslint errors, separate components;
- [Refactor] [Stock] Refactor the Stock page: types, enslint errors, separate components;
- [Refactor] [Stats] Refactor the Stats page: types, enslint errors, separate components;
- [Refactor] [Account] Refactor the Account page: types, enslint errors, separate components;
- [Refactor] [Header] Refactor the Header page: types, enslint errors, separate components;
- [Refactor] [Firebase] Refactor the firebase files, types, enslint erros;
- [Content] [App] Add the feature password forgotten;
- [✅] {Utils}{App} Create a reusable focus style;
- [✅] {Utils}{App} Create a reusable pattern style with transitions;
- [Utils] [App] Import two font form google fonts. a main font and a secondary;
- [Utils] [App] Add a global and local notFound page, add localization to it;
- [✅] {Utils}{App} Decide the colors palette to use and set the default in global.css;
- [Utils] [Layout] update the main layout page with sr-only section and anything useful;
- [Utils] [Html] update the html page with meta descriptions, title, and anything useful;
- [Utils] [Globals.css] update the global.css with all the necessary default styles;
- [Utils] [App] make the vertical scrollbar visible in desktops and not visible in mobile;
- [Utils] [App] add nextill app icon in the title instad of the next.js icons;
- [✅] {Utils}{App} create a reusable spinner;
- [✅] {Utils}{App} create reusable dividers;
- [Utils] [App] Add spinnes in all async buttons;
- [Utils] [App] Add spinnesr in all pages instead of the text loading;
- [Localization] [Till] Add localization to the till page;
- [Localization] [Menu] Add localization to the menu page;
- [Localization] [Stock] Add localization to the stock page;
- [Localization] [Stats] Add localization to the Stats page;
- [Localization] [Account] Add localization to the account page;
- [Localization] [Header] Add localization to the Header;
- [Localization] [Footer] Add localization to the footer;
- [Localization] [Intro] Add localization to the Intro page;
- [Delete] [App] delete the unused test language page;
- [A11y] [Till] Add accessibility to the Till page;
- [A11y] [Menu] Add accessibility to the Menu page;
- [A11y] [Stock] Add accessibility to the stock page;
- [A11y] [Stats] Add accessibility to the Stats page;
- [A11y] [Account] Add accessibility to the account page;
- [A11y] [Header/footer] add accessibility to the Header and Footer;
- [A11y] [Intro] Add accessibility to the intro page;
- [Test] [Account] Test the delete account feature;
- [Test] [Account] Test the reset password feature;
- [Test] [Account] Test the clear all data feature;
- [Test] [Account] Test the currency toggle feature;
- [Test] [Account] Test the language toggle feature;
- [Test] [App] Test the darkmode in all pages;
- [Test] [App] Test the email confirmation feature;
- [Test] [Till] Test how the opening and closing balance works;
- [Test] [App] Test the start/end day cycle;
- [Test] [App] Test the till, menu , stock and stats;
- [Test] [App] Run the lighthouse test;
- [Clean] [Dividers] Clean the unused dividers;
- [Optional] [Account] improve the export data feature, instead of a json file use pdf or other formats;
- [Optional] [Account] add an accessibility option to disable motion;
- [Optional] [App] add sounds effects to the till and an option in the account page to disable it;
- [Optional] [App] if necessary rewrite the pages where is possible to render them sever side 
                   instead of  client;
- [Optional] [Till] add the option to clear the entire cart;
- [Optional] [Till] decide how to set the till: use a searchbar, filters, divide by categories;
- [Optional] [Menu] Add a search bar in the menu page;
- [Optional] [App] Add the option to undo the last transactions;
- [Optional] [App] Give the user the option to create custom categories instead of the default
                   food and drinks;
- [Optional] [Menu] add the option to edit the price of each exisitng dish;
- [Optional] [App] Add options for cash/cards payment;
- [Optional] [Stock] Add in the stock activity cards the date;
