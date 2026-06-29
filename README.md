# The Page Notebook Grocery App. Version 6

This is an app where you can write down the things you need to buy at the store. The Page Notebook Grocery App also lets you make accounts save your recipes and look back at what you bought before.. The best part is that you can use it for free on the internet!

---

## What is New in Version 6

### Custom Shopping Lists

- You can save the things you buy often

- You can use these lists again and again

- You can change what is on the list before you go to the store

- These lists are great for things you buy every week or for parties

For example:

```

Save your list as "Party Stuff"

time you have a party → Click → Everything you need is on the list → You are done!

```

---

## All the Features

We have a lot of things in this app:

- You can make an account and log in

- You can have many notebooks

- You can have many pages in each notebook

- The app adds up how much everything costs

- We have some recipes already made for you

- You can make your own shopping lists

- We have a tool to help you make your shopping list

- You can look back at what you bought before and search for things

- We have a calendar to help you keep track of how much you spend

- The app is easy to use and makes new pages for you

- You can share your notebooks with your friends

- You do not need to put your information on a server

- You can use this app on the internet for free

---

## How to Start Using the App on Your Computer

1. Open the file you downloaded

2. Open the terminal on your computer in the folder

3. Type this in the terminal:

```bash

python -m http.server 8000

```

4. Open your internet browser and go to `http://localhost:8000`

### Other Ways to Start the App

If you have Node.js on your computer you can type this in the terminal:

```bash

npx server -p 8000

```

If you use VS Code you can install the "Live Server" extension and click "Open with Live Server" on the main page of the app.

---

## How to Put the App on the Internet for Free

### The Easy Way: Netlify

1. Go to the Netlify website

2.. Drop the folder with the app into Netlify

3. You are done! Your app is now on the internet

We have a guide to help you with this: see the file called `DEPLOYMENT.md`

### Other Ways to Put the App on the Internet

- Vercel: go to their website

- GitHub Pages: go to their website

- Render: go to their website

All of these options are free for this app!

---

## How to Use the App

### The First Time You Use the App

1. Click "Make an account"

2. Type in your username and password

3. Log in to your account

### Making a New Notebook

1. Click ". Make a new notebook"

2. Type in the name of your notebook

3. Click on the notebook to open it

### Adding Things to Your List

1. Click ". Add something to your list"

2. Type in what you want to buy and how much it costs

3. The app will add up how everything costs

4. Click "Save" to save your list

### Using Recipes

1. Click "Tools". Then "Shopping list"

2. Click on a recipe you like

3. The app will add all the ingredients to your list

4. Check off the things you already have

5. Click "Add to notebook" to move the list to your notebook

### Saving Your Shopping Lists

1. Make a list of things you want to buy

2. Click "Save this list"

3. Give your list a name

4. Time you want to use the list just click on it

5. You can change what is on the list if you need to

6. Click "Add to notebook" to move the list to your notebook

For example: you can save a list called "Party Stuff". Use it every time you have a party!

### Looking at Your Pages

- Click the button to go back to the last page

- Click the forward button to go to the next page (the app will make a new page if you need one)

- Click the "+" button to make a new page

### Looking at Your History

1. Click on the menu button

2. Look at the few pages you visited

3. Type in something to search for pages

4. Use the filters to look at pages from today yesterday or the last week

5. Pick a date to look at pages from that day

6. Click "Show all" to see all your pages again

7. Click on a page to open it

For example: you can search for "party". Find the list you made for your last party!

### Tracking How Much You Spend

1. Click on "Spending" at the top of the page

2. Look at the calendar to see how much you spent each day

3. Click on a day to see what you bought

4. Scroll down to see how much you spent all year

### Sharing Your Notebooks

1. Click on the menu button on your notebook

2. Click "Share"

3. Copy the link

4. Send the link to your friend

5. Your friend can click "Open share link". Paste in the link

---

## The App Works on Your Phone

You can use the app on:

- Your iPhone

- Your Android phone

- Your tablet

- Your computer

---

## How the App is Organized

The app has a lot of files and folders. Here is what they are:

```

notebook-app/

├── index.html              # The main page

├── netlify.toml           # The Netlify settings

├── _redirects             # The routing settings

├── css/

│   ├── common.css         # The styles for the app

│   ├── shelf.css          # The styles for the notebook cards

│   ├── notebook.css       # The styles for the page view

│   ├── lines.css          # The styles for the item rows

│   ├── spending.css       # The styles for the calendar

│   └── utilities.css      # The styles for the shopping list

└── js/

├── main.js            # The main code for the app

├── services/

│   ├── auth.js        # The code for logging in

│   ├── storage.js     # The code for saving data

│   └── share.js       # The code for sharing notebooks

├── ui/

│   ├── ui.shelf.js    # The code for the notebook grid

│   ├── ui.modals.js   # The code for the popups

│   ├── ui.notebook.js # The code for the page view

│   ├── ui.tools.js    # The code for the shopping list and recipes

│   ├── ui.history.js  # The code for the history sidebar

│   └── ui.spending.js # The code for the spending tracker

├── utils/

│   ├── helpers.js     # The code for helpful functions

│   └── date.js        # The code for working with dates

└── logic/

└── logic.spend.js # The code for calculating spending

```

---

## Where the App Saves Your Data

- The app saves your data in your browser

- Each users data is separate

- You can share your notebooks with your friends using links

- You can export your data as a PDF or text file (coming soon)

- Be careful not to clear your browser data or you will lose your information

---

## Important Security Note

This app has basic security for using on your own computer or with friends.

It is not good enough for information or for a lot of users.

The passwords are saved in text in your browser.

For an app you should use a server encrypt your data and use a database.

---

## Troubleshooting

If you have problems with the app try these things:

- Make sure you saved your pages

- Refresh the page

- Check if your notebook is open

If the total is not calculating try these things:

- Make sure the prices are numbers

- Try typing the price

If the recipe buttons are not working try these things:

- Refresh the page

- Make sure you are in the shopping list view

If the share link is not working try these things:

- Make sure both users are using the same link

- Make sure the link is copied completely

If your data disappeared try these things:

- Do not clear your browser data

- Click "Save" before closing the app

- The data is saved in your browser

---

## More Information

We have more documents to help you:

- `DEPLOYMENT.md`. A guide to putting the app on the internet

- `NEW_FEATURES.md`. What changed in version 4

- `CHANGES.md`. The original fixes from version 1

---

## What is Coming Next

We are working on these features:

- Exporting your data as a PDF or text file

- More recipe templates

- A way to make your own recipes

- A print view

- A mode

---

## How to Get Help

If something is not working try these things:

1. Read this document

2. Read the deployment guide

3. Refresh your browser

4. Clear your cache and try again

---

## Credits

We made this app with:

- Bootstrap 5.3.2

- Vanilla JavaScript (ES6 modules)

- Love and patience

---

The app is ready to use!

It is ready to be, on the internet!

It works on your phone!

Enjoy!
