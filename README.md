# The Page Notebook Grocery App - Version 6 🚀

A simple notebook/grocery tracking application with login, recipe templates, **custom reusable shopping lists**, enhanced history search, and ready for free hosting!

---

## 🆕 What's New in Version 6

### 💾 Custom Shopping Lists (BIG FEATURE!)
- **Save your shopping lists** with custom names
- **Reuse anytime** with one click
- **Edit before using** - remove/add items as needed
- **Perfect for**: Weekly grocery, party planning, regular shopping

**Example**: 
```
Save → "Birthday Party Essentials"
Next party → Click → All items loaded → Done! ✅
```

---

## ✨ All Features

✅ User login/signup  
✅ Multiple notebooks per user  
✅ Multiple pages per notebook  
✅ **Auto-calculating total** at bottom of page  
✅ **Recipe Templates** - 6 pre-built recipes  
✅ **Custom Shopping Lists** - Save & reuse YOUR lists  
✅ Shopping list tool  
✅ **Enhanced History** - Recent pages + search + date filters  
✅ **Spending tracker** with monthly calendar  
✅ **Smart navigation** - auto-creates pages  
✅ Share notebooks via link  
✅ All data in browser (no server needed)  
✅ **Ready to host** on Netlify/Vercel/GitHub Pages  

---

## 🚀 Quick Start - Local Testing

1. **Extract the zip file**
2. **Open terminal** in the folder
3. **Run**: 
   ```bash
   python -m http.server 8000
   ```
4. **Open browser**: `http://localhost:8000`

### Alternative Servers:

**Node.js**:
```bash
npx http-server -p 8000
```

**VS Code**: 
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 🌐 Deploy Online (Free Hosting)

### Netlify (Easiest):
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the extracted folder
3. Done! Live in 30 seconds

**Detailed guide**: See `DEPLOYMENT.md`

### Other Options:
- **Vercel**: [vercel.com](https://vercel.com)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)
- **Render**: [render.com](https://render.com)

All are **100% FREE** for this app!

---

## 📖 How to Use

### First Time:
1. Click "Create new account"
2. Enter username and password
3. Login

### Create Notebook:
1. Click "+ New Notebook"
2. Enter name (e.g., "Weekly Grocery")
3. Click the card to open

### Add Items:
1. Click "+ Add Line"
2. Enter product, quantity, price
3. Watch total calculate automatically!
4. Click "Save"

### Use Recipe Templates:
1. Click "Tools" → "Shopping List"
2. Click any recipe (e.g., 🍛 Biriyani)
3. All ingredients added!
4. Check items off as you shop
5. Click "Reflect to Notebook" to move to page

### Save Custom Shopping Lists:
1. In Shopping List, add your items
2. Click "Save Current List"
3. Name it: "Weekly Grocery" or "Birthday Party"
4. Next time: Click the saved list name
5. All items load instantly!
6. Remove/add items as needed
7. Reflect to notebook

**Example**: Save "Birthday Party Essentials" once, reuse every party! 🎉

### Navigate Pages:
- Click **<** to go back
- Click **>** to go forward (auto-creates if at end)
- Click "+" to add new page anytime

### View History:
1. Click **☰** (sidebar)
2. **Recent Pages** shows last 5 pages
3. **Search**: Type "party" to find pages
4. Use quick filters: Today, Yesterday, Week
5. Or pick custom date
6. Click "Show All" to reset
7. Click any page to open

**Example**: Search "neighbour's party" → Instantly find that shopping list!

### Track Spending:
1. Click "Spending" (top right)
2. See monthly calendar
3. Click any day to view details
4. Scroll for yearly overview

### Share Notebook:
1. Click ⋮ menu on notebook card
2. Click "Share"
3. Copy link
4. Send to friend
5. They click "Open share link" and paste

---

## 📱 Mobile Friendly

Works perfectly on:
- 📱 iPhones
- 🤖 Android phones
- 📱 Tablets
- 💻 Desktop

---

## 🗂️ File Structure

```
notebook-app/
├── index.html              # Main page
├── netlify.toml           # Netlify config
├── _redirects             # Routing config
├── css/
│   ├── common.css         # Global styles
│   ├── shelf.css          # Notebook cards
│   ├── notebook.css       # Page view
│   ├── lines.css          # Item rows
│   ├── spending.css       # Calendar
│   └── utilities.css      # Shopping list
└── js/
    ├── main.js            # App initialization
    ├── services/
    │   ├── auth.js        # Login/signup
    │   ├── storage.js     # Data handling
    │   └── share.js       # Share links
    ├── ui/
    │   ├── ui.shelf.js    # Notebook grid
    │   ├── ui.modals.js   # Popups
    │   ├── ui.notebook.js # Main page view
    │   ├── ui.tools.js    # Shopping list + recipes
    │   ├── ui.history.js  # History sidebar
    │   └── ui.spending.js # Spending tracker
    ├── utils/
    │   ├── helpers.js     # Utility functions
    │   └── date.js        # Date helpers
    └── logic/
        └── logic.spend.js # Spending calculations
```

---

## 💾 Data Storage

- **Where**: Browser localStorage
- **Who**: Each user's data separate
- **Sharing**: Works via share links
- **Backup**: Export as PDF/TXT (coming soon)
- **Warning**: Clearing browser data = data lost

---

## 🔒 Security Note

This is **beginner-level authentication** for local/hobby use.

**NOT suitable for**:
- Sensitive data
- Real passwords
- Production apps with many users

**Passwords are stored in plain text** in localStorage.

For real apps, use:
- Backend server
- Proper encryption
- Database

---

## ❓ Troubleshooting

**History is empty**:
- Make sure you saved pages
- Try refreshing the page
- Check if notebook is open

**Total not calculating**:
- Make sure prices are numbers
- Try typing price again

**Recipe buttons not working**:
- Refresh the page
- Make sure you're in Shopping List view

**Share link not working**:
- Both users must access same URL
- Make sure link copied completely

**Data disappeared**:
- Don't clear browser data
- Click "Save" before closing
- Data is per-browser

---

## 📚 Additional Documentation

- `DEPLOYMENT.md` - Hosting guide
- `NEW_FEATURES.md` - What changed in v4
- `CHANGES.md` - Original fixes from v1

---

## 🎯 Coming Soon

- PDF/TXT export
- More recipe templates
- Custom recipe creator
- Print view
- Dark mode

---

## 📞 Support

If something doesn't work:
1. Check this README
2. Read DEPLOYMENT.md
3. Try refreshing browser
4. Clear cache and retry

---

## 🎉 Credits

Built with:
- Bootstrap 5.3.2
- Vanilla JavaScript (ES6 modules)
- Love and patience ❤️

---

**Version**: 6.0  
**Ready to host**: ✅  
**Mobile ready**: ✅  
**Production ready**: ✅  

Enjoy! 🎊
