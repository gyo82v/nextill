NEXTILL IMPLEMENTATION LIST

- [✅] {Design}{Header} Design the nextill logo;
- [✅] {Content}{App} Make the app Progressive  web App, add a manifest file, icons, html etc;
- [✅] {Design}{App} Design the icon app used when the app is installed;
- [✅] {refactor}{Firestore} Modify the create new account function to add email confirmation;
- [✅] {Content}{Header} build the navigation bar for mobile, add icon, when clicked open the 
                     navigation menu;
- [✅] {Content}{Menu} Add the feature in the Menu page to clear all menu with a button;
- [✅] {Content}{Stock} Add the feature in the Stock page to clear all stock with a button;
- [✅] {Content}{Account} Add a feature in the Account page to clear all stats with a button;
- [✅] {Style}{Header} style the mobile navigation menu;
- [✅] {Content}{Pos} create a confirm order modal/page; when the user clicks on the checkout button
        the modal/page opens; it has a recap of the order, buttons to proceed or cancel;
        option to print the ticket;
- [✅] {Content}{Pos} implement the printing option in the confirmation modal/page, when the user clicks 
        and complete the order if the print option is on it will open the browser print page and 
        if possible print automatically;
- [✅] {Content}{pos} create the ticket component that will have the items bought, name, price, quantity,
        separate in section drinks and food;
- [✅] {Style}{App} Style the language toggle;
- [✅] {Refactor}{Header} modify the darkmode toggle to use icons instead of text, add accessibility
                      and decide if while in logged in mode it should be in the Header or Account page;
- [✅] {Refactor}{Header} Remove the language toggle from the Header in logged in mode;
- [✅] {Style}{Header} Style the Header for mobile/desktop in logged in/off mode;
- [✅] {Style}{Header} Style the navigation bar for desktop;
- [✅] {Style}{Header} Style the sign out button and the username;
- [✅] {Content}{Header} Add a confirmation modal when the user clicks the sign out button;
- [✅] {Style}{Header} Style the language and darkmode toggles in the header in logged off mode;
- [✅] {Content}{Footer} Add information in the footer like: project-demo, @nextill, a mail option etc;
- [✅] {Content}{Account} Add privacy policy;
- [✅] {Content}{Account} Add enable/disable printing option;
- [✅] {Content}{Account} Add the enable balance option;
- [✅] {Content}{App} create a privacy policy page;
- [✅] {Style}{Footer} Style the footer for mobile/desktop;
- [✅] {Content}{Intro} add an introduction description in the intro page with h1, p ... it should 
        describe what this app does, welcome the user, that is a free app, add more 
        content in the desktop version;
- [✅] {Style}{Intro} Style the sign in form component;
- [✅] {Style}{Intro} Style the create new account form component;
- [✅] {Content}{Intro} Add in the create new acoount component a By creating an account,
        you agree to the Privacy Policy. with link to the page;
- [Fix] [Till] fix a visual bug, when a user sign in and the day is not active the till page 
               should immediately render the not active section and not briefly the active section;
- [✅] {Fix}{App} Fix all the url to match the updated path => till => pos, statistics => reports etc;
- [✅] {Style}{Pos} Style the till page while the day is not active;
- [✅] {Content}{Pos} Add a description in the till page while the day is not active;
- [✅] {style}{Pos} Style the item card element;
- [✅] {Style}{Pos} Style the till page so that the items are divided into sections: food and drinks;
- [✅] {Style}{Pos} Style the cart section of the till page;
- [✅] {Style}{Pos} Style the end day section in the till page;
- [✅] {Style}{Pos} Style the Till page and the layout of the page for mobile/desktops;
- [✅] {Content}{Pos} Add a title and brief description in the till page;
- [✅] {Content}{Menu} Add a title and a brief description in the menu page;
- [✅] {Style}{Menu} Style the add new item in the menu form component;
- [✅] {Style}{Menu} Style the current menu list section;
- [✅] {Style}{Menu} Style the menu page and layout for desktop/mobile;
- [Fix] [App] Fix the bug where some currency(usd) do not render the symbol but the text;
- [✅] {Style}{Stock} Style the add new item to the stock form in the stock page;
- [✅] {Style}{Stock} Style the current stock items list, search bar and filters in the current items 
        section in the stock page;
- [✅] {Style}{Stock} Style the stock activity section in the stock page;
- [✅] {Style}{Stock} Style the page and layout for mobile/desktop;
- [✅] {Style}{Stock} Style the items card, style each different state : normal, low stock and negative;
- [✅] {Content}{Stock} Add a title and description in the stock page;
- [✅] {Style}{Reports} Style the global section of the stats page;
- [✅] {Style}{Reports} Style the current day section in the stats page;
- [✅] {Style}{Reports} Style the days overview section in the Stats page;
- [✅] {Style}{Reports} Style the Stats page and layout for mobile/desktop;
- [✅] {Content}{Reports} Add a title and description to the stats page and for each section;
- [✅] {Style}{Reports} Style the current day transactions section and each transaction card;
- [✅] {Style}{Reports} Style the daily overview cards;
- [✅] {Style}{Account} Style the account page and the layout for mobile/desktop;
- [✅] {Style}{Account} Style each section in the account page: profile,security,export data,
        preferences and mantainance;
- [✅] {style}{Account} Style the modal section when the user try to clear all data;
- [✅] {Refactor}{App} Refactor the language feature to support spanish, french and german;
- [✅] {Refactor}{Intro} Refactor the intro page: types, enslint errors, separate components;
- [✅] {Refactor}{Pos} Refactor the Till page: types, enslint errors, separate components;
- [✅] {Refactor}{Menu} Refactor the Menu page: types, enslint errors, separate components;
- [✅] {Refactor}{Stock} Refactor the Stock page: types, enslint errors, separate components;
- [✅] {Refactor}{Reports} Refactor the Stats page: types, enslint errors, separate components;
- [✅] {refactor}{Account} Refactor the Account page: types, enslint errors, separate components;
- [✅] {Refactor}{Header} Refactor the Header page: types, enslint errors, separate components;
- [✅] {Refactor}{Firebase} Refactor the firebase files, types, enslint erros;
- [✅] {Content}{App} Add the feature password forgotten;
- [✅] {Utils}{App} Create a reusable focus style;
- [✅] {Utils}{App} Create a reusable pattern style with transitions;
- [✅] {Utils}{App} Import two font form google fonts. a main font and a secondary;
- [✅] {Utils}{App} Add a global and local notFound page, add localization to it;
- [✅] {Utils}{App} Decide the colors palette to use and set the default in global.css;
- [✅] {Utils}{Layout} update the main layout page with sr-only section and anything useful;
- [✅] {Utils}{Html} update the html page with meta descriptions, title, and anything useful;
- [✅] {Utils}{Globals} update the global.css with all the necessary default styles;
- [✅] {Utils}{App} make the vertical scrollbar visible in desktops and not visible in mobile;
- [✅] {Utils}{App} add nextill app icon in the title instad of the next.js icons;
- [✅] {Utils}{App} create a reusable spinner;
- [✅] {Utils}{App} create reusable dividers;
- [✅] {Utils}{App} Add spinnes in all async buttons;
- [Utils] [App] Add spinners in all pages instead of the text loading;
- [✅] {Utils}{Inputs} Add the show pssw icon in the pssw inputs field;
- [✅] {Localization}{Pos} Add localization to the till page;
- [✅] {Localization}{Menu} Add localization to the menu page;
- [✅] {Localization}{Stock} Add localization to the stock page;
- [✅] {Localization}{Reports} Add localization to the Stats page;
- [✅] {Localization}{Account} Add localization to the account page;
- [✅] {Localization}{Privacy-Policy} add localization to the privacy policy page;
- [✅] {Localization}{Header} Add localization to the Header;
- [✅] {Localization}{Footer} Add localization to the footer;
- [✅] {Localization}{Intro} Add localization to the Intro page;
- [✅] {Delete}{App} delete the unused test language page;
- [✅] {A11y}{Pos} Add accessibility to the Till page;
- [✅] {A11y}{Menu} Add accessibility to the Menu page;
- [✅] {A11y}{Stock} Add accessibility to the stock page;
- [✅] {A11y}{Reports} Add accessibility to the Stats page;
- [✅] {A11y}{Account} Add accessibility to the account page;
- [✅] {A11y}{Header/Footer} add accessibility to the Header and Footer;
- [✅] {A11y}{Intro} Add accessibility to the intro page;
- [✅] {A11y}{Privacy-Policy} add accessibility to the privacy-policy page;
- [✅] {Test}{Account} Test the delete account feature;
- [✅] {Test}{Account} Test the reset password feature;
- [Test] [Account] Test the clear all data feature;
- [Test] [Account] Test the currency toggle feature;
- [✅] {Test}{Account} Test the language toggle feature;
- [Test] [App] Test the darkmode in all pages;
- [✅] {Test}{App} Test the email confirmation feature;
- [Test] [Till] Test how the opening and closing balance works;
- [Test] [App] Test the start/end day cycle;
- [Test] [App] Test the till, menu , stock and stats;
- [Test] [App] Run the lighthouse test;
- [✅] {Fix}{Account} Fix the delete account function; at the moment it deletes only the auth.
        it should delete the firestore users doc associated;
- [✅] {Fix}{Account} Fix the clear all data function; it should reset the data of the entire app.
        at the moment it just clear the stock collections and nothing else;
- [✅] {Fix}{App} add printingEnabled anywhere in the firebase functions where needed;
        in particular when creating a new account;
- [✅] {Fix}{Pos} add the dynamically rendering of the balace depending on the balanceEnabled in 
        the database in the start/end section in the pos page;
- [✅] {Fix}{Reports} when a menu item is deleted, in the stats page it show the id and not the name;
- [✅] {Fix}{Header} fix the text color of the navbar links for the darkmode;
- [✅] {Fix}{Stock} fix the issue where the stock item amount is not allowed to go below zero;
- [✅] {Fix}{Select-component} Fix the select compound component. When too many elements are in the options
        there should be a scroll sidebar, this will fix the height issue in the menu page;
- [✅] {Fix}{Menu} fix the style for the menu page when the content is stacked vertically for mobile
        and small screens;
- [✅] {Fix}{App} add the category "bundle" to menu items everywhere is needed;
- [✅] {Fix}{Reports} in the reports page most sections render the id of an item while they should 
        render the name;
- [✅] {Fix}{Languages} fix the issue when there are multiple files common and privacy in the same page;
- [✅] {Fix}{header} fix the header on screens smaller than lg, at the moment there is too much content 
        use the mobile version for these screens;
- [✅] {Fix}{Privacy Policy} fix the "back" button link. at the moment it navigate the user to the pos page;
- [✅] {fix}{Balance} the balance option should not be possible to change it while the day is actice;
- [✅] {Fix}{Menu} in the add new item to the menu fix the situation where there are no 
        items in the stock. the select component should render something better than and 
        empty option list;
- [✅] {fix}{Account} fix the delete account with password; the password must match the user password.
        now any text work;
- [✅] {Clean}{Dividers} Clean the unused dividers;
- [✅] {Clean}{AppHeader} Clean the unused code in the Navbar component;
- [✅] {Optional}{Account} improve the export data feature, instead of a json file use pdf or other formats;
- [✅] {Optional}{Account} add an accessibility option to disable motion;
- [✅] {Optional}{App} add sounds effects to the till and an option in the account page to disable it;
- [✅] {Optional}{Pos} decide how to set the till: use a searchbar, filters, divide by categories;
- [✅] {optional}{menu} Add a search bar in the menu page;
- [Optional] [Menu] add the option to edit the price of each exisitng dish;
- [Optional] [App] Add options for cash/cards payment;
- [✅] {Optional}{Stock} Add in the stock activity cards the date;
- [✅] {Optional/fix}{Navbar} fix the navbar animation pill; when the sixe on the navbars links changes, 
        the pill should resize corretly automatically.
        example: changing language in the account page;
- [✅] {Optional}{Footer} Fix the footer height, on mobile device, in particular the AppFooter. 
- [optional] [App] Add the the option to update the current email;
- [✅] {Optional}{App} Create a custom modal component for the confirmation action like 
        delete account, clear menu, clear stock, clear all etc;
- [✅] {Optional}{Account} Add a function that will clear all archived items in the stock;
- [✅] {Optional}{Stock} add a default unit when creating a new stock item. example: "unit", "pcs"
- [✅] {Optional}{stock} add a show button to the stock activity section and render the section
        dinamicaly;
- [✅] {Optional}{Stock} in the stock activity acrd add an icon for add, remove or archieved;
- [Optional] [App] Add discount system;
- [✅] {Optional}{Stock} Add another category to the stock items for non food/drink items;
- [✅] {Optional}{App} Translate the errors messages where necessary;
- [✅] {Optional}{Pos} fix the scrollbar for the cart section if it makes the app better;
- [✅] {optional}{app} find a use for the balance feature like adding it into the day overview section with 
                   the amount of the start*end balance;
- [Optional] [Motion] find a use for the enable/disable motion in the account;
- [Optional] [Localization] add localization in the pos and account page for the discount section;
- [Optional] [add the discount in the receipt];                          