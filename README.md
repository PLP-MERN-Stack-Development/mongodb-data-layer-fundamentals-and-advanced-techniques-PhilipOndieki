# 🚀 How to Run the MongoDB Bookstore Project

**Student:** Philip Ondieki 
**Course:** PLP Software Development  
**Assignment:** Week 1 - MongoDB Fundamentals  
**Date:** October 2025

---

This guide provides step-by-step instructions to run all the scripts in this MongoDB assignment.

## 📋 Prerequisites Checklist

Before you begin, make sure you have installed:

- [ ] **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB Community Edition** - [Download](https://www.mongodb.com/try/download/community)
- [ ] **MongoDB Shell (mongosh)** - Comes with MongoDB
- [ ] **MongoDB Compass** (Optional but recommended) - [Download](https://www.mongodb.com/try/download/compass)
- [ ] **Git** - [Download](https://git-scm.com/)

### Verify Installations

Open your terminal and run these commands:

```bash
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check npm version
npm --version
# Expected output: 9.x.x or higher

# Check MongoDB version
mongod --version
# Expected output: db version v7.x.x or v6.x.x

# Check MongoDB Shell
mongosh --version
# Expected output: 2.x.x or 1.x.x
```

---

## 🔧 Setup Instructions

### Step 1: Clone Your Repository

```bash
# Clone your GitHub Classroom repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Navigate into the project directory
cd YOUR-REPO-NAME
```

### Step 2: Install Node.js Dependencies

```bash
# Initialize npm (creates package.json if needed)
npm init -y

# Install MongoDB driver
npm install mongodb
```

You should see a `node_modules` folder and `package.json` file created.

### Step 3: Start MongoDB Server

Choose the method that works for your operating system:

#### **Option A: Run MongoDB as a Foreground Process**

**macOS/Linux:**
```bash
# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Start MongoDB
mongod --dbpath ~/data/db
```

**Windows:**
```bash
# Create data directory if it doesn't exist
mkdir C:\data\db

# Start MongoDB
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath C:\data\db
```

**Important:** Keep this terminal window open while running the scripts!

#### **Option B: Run MongoDB as a Background Service**

**macOS (using Homebrew):**
```bash
# Start MongoDB service
brew services start mongodb-community

# Check if running
brew services list
```

**Linux (using systemd):**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

**Windows (as Windows Service):**
```bash
# Start MongoDB service
net start MongoDB

# Or use Services app (search "Services" in Start menu)
```

### Step 4: Verify MongoDB is Running

Open a **new terminal window** and run:

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/...
Using MongoDB: 7.0.x
Using Mongosh: 2.x.x

test>
```

Type `exit` to close mongosh.

---

## ▶️ Running the Scripts

### Method 1: Using Node.js (Recommended)

#### Step 1: Insert Sample Books

```bash
node insert_books.js
```

**Expected Output:**
```
Connected to MongoDB server
Collection already contains X documents. Dropping collection...
Collection dropped successfully
12 books were successfully inserted into the database

Inserted books:
1. "To Kill a Mockingbird" by Harper Lee (1960)
2. "1984" by George Orwell (1949)
3. "The Great Gatsby" by F. Scott Fitzgerald (1925)
... (and more)
Connection closed
```

✅ **Success!** Your database is now populated with books published after 1920.

#### Step 2: Run All Queries

```bash
node queries.js
```

**Expected Output:**
```
Connected to MongoDB

=== TASK 2: BASIC CRUD OPERATIONS ===

1. All Fiction books:
   - To Kill a Mockingbird by Harper Lee
   - The Great Gatsby by F. Scott Fitzgerald
   ... (and more results)

2. Books published after 2000:
   ... (query results)

... (continues with all tasks)

=== ALL QUERIES COMPLETED SUCCESSFULLY ===

Connection closed
```

✅ **Success!** All queries have been executed.

---

### Method 2: Using MongoDB Shell (Alternative)

If you prefer using the MongoDB Shell directly:

#### Step 1: Start MongoDB Shell

```bash
mongosh
```

#### Step 2: Run Insert Script

```javascript
// Load and run the insert script
load('insert_books.js')
```

Or manually copy-paste the book data:

```javascript
use plp_bookstore

db.books.insertMany([
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  // ... copy rest of the books from insert_books.js
])
```

#### Step 3: Run Individual Queries

```javascript
// Switch to database
use plp_bookstore

// Example: Find all Fiction books
db.books.find({ genre: 'Fiction' })

// Example: Find books published after 1920
db.books.find({ published_year: { $gt: 1920 } })

// Example: Create index
db.books.createIndex({ title: 1 })

// Example: Run aggregation
db.books.aggregate([
  {
    $group: {
      _id: '$genre',
      avgPrice: { $avg: '$price' }
    }
  }
])
```

---

## 🔍 Viewing Your Data

### Using MongoDB Shell

```bash
# Start mongosh
mongosh

# Connect to database
use plp_bookstore

# View all books
db.books.find()

# View books formatted nicely
db.books.find().pretty()

# Count documents
db.books.countDocuments()

# View books published after 1920
db.books.find({ published_year: { $gt: 1920 } })

# View first 5 books
db.books.find().limit(5)
```

### Using MongoDB Compass (GUI)

1. **Download and install** MongoDB Compass from [here](https://www.mongodb.com/try/download/compass)

2. **Open MongoDB Compass**

3. **Connect** using: `mongodb://localhost:27017`

4. **Navigate** to:
   - Database: `plp_bookstore`
   - Collection: `books`

5. **View your data** in a visual interface

6. **Take a screenshot** for your assignment submission! (See below)

---

## 📸 Taking Screenshots for Submission

### Required Screenshots

You need to include the following screenshots in your submission:

#### Screenshot 1: MongoDB Compass - Collection View
**Location:** `screenshots/compass_collection_view.png`

**What to capture:**
- MongoDB Compass showing your `plp_bookstore` database
- The `books` collection with document count
- At least 3-5 visible documents showing all fields (title, author, genre, published_year, price, in_stock, pages, publisher)

**Steps:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Click on `plp_bookstore` database in the left sidebar
4. Click on `books` collection
5. Make sure you can see the documents with all fields visible
6. Take a screenshot (use your OS screenshot tool)
7. Save as `screenshots/compass_collection_view.png`

#### Screenshot 2: MongoDB Compass - Indexes View
**Location:** `screenshots/compass_indexes_view.png`

**What to capture:**
- The "Indexes" tab in MongoDB Compass
- Showing all created indexes:
  - `_id_` (default)
  - `title_1`
  - `author_1_published_year_-1` (compound index)

**Steps:**
1. In MongoDB Compass, while viewing the `books` collection
2. Click on the "Indexes" tab
3. Take a screenshot showing all three indexes
4. Save as `screenshots/compass_indexes_view.png`

#### Screenshot 3: Query Results (Optional but Recommended)
**Location:** `screenshots/query_results.png`

**What to capture:**
- Terminal output showing successful execution of `node queries.js`
- Should show at least the CRUD operations section

**Steps:**
1. Run `node queries.js` in your terminal
2. Take a screenshot of the output
3. Save as `screenshots/query_results.png`

### Creating the Screenshots Folder

```bash
# Create screenshots directory
mkdir screenshots

# Verify it was created
ls -la
```

### Screenshot Tips

- **High Quality:** Use PNG format for clarity
- **Full View:** Capture the entire window, not just part of it
- **Readable Text:** Ensure text is large enough to read
- **Proper Naming:** Use exact filenames as specified above
- **No Sensitive Info:** Don't include personal connection strings if using Atlas

### macOS Screenshot Shortcuts
```
Cmd + Shift + 3  # Full screen
Cmd + Shift + 4  # Selection
Cmd + Shift + 5  # Advanced options
```

### Windows Screenshot Shortcuts
```
Windows + Shift + S  # Snipping tool
Print Screen         # Full screen
Alt + Print Screen   # Active window
```

### Linux Screenshot
```
# Most distros: Shift + Print Screen
# Or use: gnome-screenshot, flameshot, etc.
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Error Message:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   
   # Windows
   tasklist | findstr mongod
   ```

2. **Start MongoDB:**
   ```bash
   # See Step 3 above for your OS
   mongod --dbpath ~/data/db
   ```

3. **Check MongoDB port:**
   ```bash
   # Default port is 27017
   lsof -i :27017  # macOS/Linux
   netstat -ano | findstr :27017  # Windows
   ```

---

### Problem: "Cannot find module 'mongodb'"

**Error Message:**
```
Error: Cannot find module 'mongodb'
```

**Solution:**
```bash
# Make sure you're in the project directory
pwd

# Install MongoDB driver
npm install mongodb

# Verify installation
ls node_modules | grep mongodb
```

---

### Problem: "Database already exists with different data"

**Solution:**
```bash
# Start mongosh
mongosh

# Drop the existing database
use plp_bookstore
db.dropDatabase()

# Exit mongosh
exit

# Re-run insert script
node insert_books.js
```

---

### Problem: "Permission denied" when starting MongoDB

**macOS/Linux:**
```bash
# Make sure data directory has correct permissions
sudo chown -R $(whoami) ~/data/db

# Or use a different directory
mongod --dbpath ~/mongo-data
```

**Windows:**
```bash
# Run Command Prompt or PowerShell as Administrator
# Then start MongoDB
```

---

### Problem: Scripts run but show no output

**Solution:**

1. **Check your terminal encoding:**
   - Windows: Use PowerShell or Git Bash instead of CMD
   
2. **Add verbose logging:**
   ```bash
   node insert_books.js 2>&1 | more
   ```

3. **Check MongoDB logs:**
   ```bash
   # Default log location
   # macOS: /usr/local/var/log/mongodb/mongo.log
   # Linux: /var/log/mongodb/mongod.log
   # Windows: C:\Program Files\MongoDB\Server\7.0\log\mongod.log
   ```

---

## 📊 Expected Results Summary

After running both scripts, you should have:

### Database Structure
```
plp_bookstore (database)
  └── books (collection)
      ├── 11 documents (books from 1920s onwards, after deletion)
      └── Indexes:
          ├── _id_ (default)
          ├── title_1
          └── author_1_published_year_-1
```

### Sample Queries Results

| Query Type | Expected Count |
|------------|----------------|
| Total books | 11 (after deletion) |
| Fiction books | ~4-5 |
| Books published after 1920 | All books |
| Books published after 2000 | 0 |
| Books by George Orwell | 2 |
| Unique genres | 6-7 |

### Book Publication Years
All books in the database are published **after 1920**:
- 1925: The Great Gatsby
- 1932: Brave New World
- 1937: The Hobbit
- 1945: Animal Farm
- 1947: Wuthering Heights
- 1949: 1984
- 1951: The Catcher in the Rye (deleted in queries)
- 1954: The Lord of the Rings
- 1960: To Kill a Mockingbird
- 1988: The Alchemist
- (etc.)

---

## ✅ Verification Checklist

Before submitting, verify:

- [ ] MongoDB is installed and running
- [ ] `node insert_books.js` runs successfully
- [ ] Database `plp_bookstore` exists
- [ ] Collection `books` has 11-12 documents (all published after 1920)
- [ ] `node queries.js` runs without errors
- [ ] All indexes are created (can verify in Compass)
- [ ] **Screenshots taken and saved in `screenshots/` folder**
  - [ ] `compass_collection_view.png`
  - [ ] `compass_indexes_view.png`
  - [ ] `query_results.png` (optional)
- [ ] All files committed to GitHub
- [ ] Repository pushed to GitHub Classroom

---

## 📦 Final Project Structure

Your repository should look like this:

```
mongodb-bookstore-assignment/
├── insert_books.js                    # Script to populate database
├── queries.js                         # All MongoDB queries
├── README2.md                          # Project documentation
├── README.md                           # This file
├── package.json                       # Node.js dependencies
├── package-lock.json                  # Dependency lock file
├── node_modules/                      # Dependencies (not committed)
│   └── mongodb/
└── screenshots/                       # Required screenshots
    ├── compass_collection_view.png   # Collection with documents
    ├── compass_indexes_view.png      # Indexes view
    └── query_results.png             # Terminal output (optional)
```

**Note:** Don't commit `node_modules/` to GitHub! It's already in `.gitignore`.

---

## 🎯 Quick Start (TL;DR)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd <repo-name>

# 2. Install dependencies
npm install mongodb

# 3. Start MongoDB (in separate terminal)
mongod --dbpath ~/data/db

# 4. Insert books (all from 1920s onwards)
node insert_books.js

# 5. Run queries
node queries.js

# 6. Open MongoDB Compass and take screenshots
# Connect to mongodb://localhost:27017
# Navigate to plp_bookstore > books
# Take screenshots of:
#   - Collection view with documents
#   - Indexes tab

# 7. Save screenshots
mkdir screenshots
# Save your screenshots in this folder

# 8. Commit and push
git add .
git commit -m "Complete MongoDB Week 1 assignment"
git push origin main
```

---

## 📞 Getting Help

If you're still having issues:

1. **Check MongoDB logs** for error messages
2. **Review PLP course materials** on MongoDB
3. **Ask in PLP discussion forum** with:
   - Your error message
   - Your operating system
   - Steps you've already tried
4. **Contact your PLP instructor** during office hours
5. **Check PLP Discord/Slack** for help from classmates

### Common PLP Student Issues

**Issue:** "I'm using MongoDB Atlas instead of local MongoDB"
- Update the connection URI in both scripts to your Atlas connection string
- Format: `mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/`
- Make sure to whitelist your IP address in Atlas

**Issue:** "I already have data in my database"
- Run `db.books.drop()` in mongosh to start fresh
- Or change the database name in the scripts

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Shell Reference](https://docs.mongodb.com/mongodb-shell/)
- [Node.js MongoDB Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [PLP Learning Platform](https://plp.com) - Course materials

---

## 🎓 Submission Instructions

### Step 1: Verify Everything Works
- Run all scripts successfully
- Take all required screenshots
- Check that all files are present

### Step 2: Commit to GitHub
```bash
# Add all files
git add .

# Commit with a meaningful message
git commit -m "Complete MongoDB Week 1 assignment - Added books from 1920s onwards with screenshots"

# Push to GitHub
git push origin main
```

### Step 3: Verify on GitHub
- Go to your GitHub repository in your browser
- Verify all files are there
- Check that screenshots folder is visible
- Ensure README.md displays correctly

### Step 4: Submit via GitHub Classroom
- Your submission is automatically tracked via GitHub Classroom
- The autograding will run on your latest push
- Check for any feedback from the automated tests

### Step 5: Wait for Instructor Review
- Instructor will review your submission
- Check for comments or feedback on your commits
- Respond to any questions promptly

---


**Last Updated:** October 2025  
**Course:** PLP Software Development - Week 1  
**Instructor:** Dedan Okware
