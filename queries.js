// queries.js - MongoDB queries using Node.js driver
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // ========================================
    // TASK 2: BASIC CRUD OPERATIONS
    // ========================================
    console.log('=== TASK 2: BASIC CRUD OPERATIONS ===\n');

    // 1. Find all books in a specific genre
    console.log('1. All Fiction books:');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    fictionBooks.forEach(book => console.log(`   - ${book.title} by ${book.author}`));

    // 2. Find books published after a certain year
    console.log('\n2. Books published after 1920:');
    const recentBooks = await collection.find({ published_year: { $gt: 1920 } }).toArray();
    recentBooks.forEach(book => console.log(`   - ${book.title} (${book.published_year})`));

    // 3. Find books by a specific author
    console.log('\n3. Books by George Orwell:');
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    orwellBooks.forEach(book => console.log(`   - ${book.title}`));

    // 4. Update the price of a specific book
    console.log('\n4. Updating price of "The Great Gatsby" to $15.99:');
    const updateResult = await collection.updateOne(
      { title: 'The Great Gatsby' },
      { $set: { price: 15.99 } }
    );
    console.log(`   Modified ${updateResult.modifiedCount} document(s)`);
    const updatedBook = await collection.findOne({ title: 'The Great Gatsby' });
    console.log(`   New price: $${updatedBook.price}`);

    // 5. Delete a book by its title
    console.log('\n5. Deleting "The Catcher in the Rye":');
    const deleteResult = await collection.deleteOne({ title: 'The Catcher in the Rye' });
    console.log(`   Deleted ${deleteResult.deletedCount} document(s)`);
    const remainingCount = await collection.countDocuments();
    console.log(`   Remaining books: ${remainingCount}`);

    // ========================================
    // TASK 3: ADVANCED QUERIES
    // ========================================
    console.log('\n\n=== TASK 3: ADVANCED QUERIES ===\n');

    // 1. Find books that are both in stock and published after 2010
    console.log('1. Books in stock AND published after 2010:');
    const inStockRecent = await collection.find({
      $and: [
        { in_stock: true },
        { published_year: { $gt: 2010 } }
      ]
    }).toArray();
    if (inStockRecent.length > 0) {
      inStockRecent.forEach(book => console.log(`   - ${book.title} (${book.published_year})`));
    } else {
      console.log('   No books found matching criteria');
    }

    // 2. Use projection to return only title, author, and price
    console.log('\n2. Books with projection (title, author, price only):');
    const projectedBooks = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).limit(5).toArray();
    projectedBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author} - $${book.price}`);
    });

    // 3. Sort books by price - Ascending
    console.log('\n3a. Books sorted by price (ascending) - Top 5:');
    const sortedAsc = await collection.find(
      {},
      { projection: { title: 1, price: 1, _id: 0 } }
    ).sort({ price: 1 }).limit(5).toArray();
    sortedAsc.forEach(book => console.log(`   - ${book.title}: $${book.price}`));

    // 3b. Sort books by price - Descending
    console.log('\n3b. Books sorted by price (descending) - Top 5:');
    const sortedDesc = await collection.find(
      {},
      { projection: { title: 1, price: 1, _id: 0 } }
    ).sort({ price: -1 }).limit(5).toArray();
    sortedDesc.forEach(book => console.log(`   - ${book.title}: $${book.price}`));

    // 4. Pagination - 5 books per page
    console.log('\n4a. Pagination - Page 1 (books 1-5):');
    const page1 = await collection.find(
      {},
      { projection: { title: 1, author: 1, _id: 0 } }
    ).limit(5).skip(0).toArray();
    page1.forEach((book, i) => console.log(`   ${i + 1}. ${book.title} by ${book.author}`));

    console.log('\n4b. Pagination - Page 2 (books 6-10):');
    const page2 = await collection.find(
      {},
      { projection: { title: 1, author: 1, _id: 0 } }
    ).limit(5).skip(5).toArray();
    page2.forEach((book, i) => console.log(`   ${i + 6}. ${book.title} by ${book.author}`));

    // ========================================
    // TASK 4: AGGREGATION PIPELINE
    // ========================================
    console.log('\n\n=== TASK 4: AGGREGATION PIPELINE ===\n');

    // 1. Calculate average price by genre
    console.log('1. Average price of books by genre:');
    const avgByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      },
      {
        $project: {
          genre: '$_id',
          averagePrice: { $round: ['$averagePrice', 2] },
          bookCount: 1,
          _id: 0
        }
      }
    ]).toArray();
    avgByGenre.forEach(item => {
      console.log(`   - ${item.genre}: $${item.averagePrice} (${item.bookCount} books)`);
    });

    // 2. Find the author with the most books
    console.log('\n2. Author with the most books:');
    const topAuthor = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
          titles: { $push: '$title' }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();
    if (topAuthor.length > 0) {
      console.log(`   - ${topAuthor[0]._id}: ${topAuthor[0].bookCount} books`);
      console.log(`     Titles: ${topAuthor[0].titles.join(', ')}`);
    }

    // 3. Group books by publication decade
    console.log('\n3. Books grouped by publication decade:');
    const byDecade = await collection.aggregate([
      {
        $project: {
          title: 1,
          published_year: 1,
          decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
              's'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          bookCount: { $sum: 1 },
          books: { $push: { title: '$title', year: '$published_year' } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    byDecade.forEach(item => {
      console.log(`   - ${item._id}: ${item.bookCount} book(s)`);
      item.books.forEach(book => console.log(`     • ${book.title} (${book.year})`));
    });

    // ========================================
    // TASK 5: INDEXING
    // ========================================
    console.log('\n\n=== TASK 5: INDEXING ===\n');

    // 1. Create index on title field
    console.log('1. Creating index on "title" field...');
    await collection.createIndex({ title: 1 });
    console.log('   ✓ Index created successfully');

    // 2. Create compound index on author and published_year
    console.log('\n2. Creating compound index on "author" and "published_year"...');
    await collection.createIndex({ author: 1, published_year: -1 });
    console.log('   ✓ Compound index created successfully');

    // 3. Show all indexes
    console.log('\n3. All indexes on books collection:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // 4. Performance comparison using explain()
    console.log('\n4. Performance Analysis:');
    
    console.log('\n   a) Query WITHOUT index (collection scan on "pages"):');
    const explainNoIndex = await collection.find({ pages: { $gt: 300 } }).explain('executionStats');
    console.log(`      - Execution Time: ${explainNoIndex.executionStats.executionTimeMillis}ms`);
    console.log(`      - Documents Examined: ${explainNoIndex.executionStats.totalDocsExamined}`);
    console.log(`      - Documents Returned: ${explainNoIndex.executionStats.nReturned}`);

    console.log('\n   b) Query WITH index on "title":');
    const explainWithIndex = await collection.find({ title: '1984' }).explain('executionStats');
    console.log(`      - Execution Time: ${explainWithIndex.executionStats.executionTimeMillis}ms`);
    console.log(`      - Documents Examined: ${explainWithIndex.executionStats.totalDocsExamined}`);
    console.log(`      - Documents Returned: ${explainWithIndex.executionStats.nReturned}`);
    console.log(`      - Index Used: ${explainWithIndex.executionStats.executionStages.indexName || 'N/A'}`);

    console.log('\n   c) Query WITH compound index:');
    const explainCompound = await collection.find({ 
      author: 'J.R.R. Tolkien',
      published_year: { $gte: 1950 }
    }).explain('executionStats');
    console.log(`      - Execution Time: ${explainCompound.executionStats.executionTimeMillis}ms`);
    console.log(`      - Documents Examined: ${explainCompound.executionStats.totalDocsExamined}`);
    console.log(`      - Documents Returned: ${explainCompound.executionStats.nReturned}`);

    // ========================================
    // BONUS: Additional Queries
    // ========================================
    console.log('\n\n=== BONUS: ADDITIONAL QUERIES ===\n');

    console.log('Top 5 most expensive books:');
    const expensive = await collection.aggregate([
      { $sort: { price: -1 } },
      { $limit: 5 },
      { $project: { title: 1, author: 1, price: 1, _id: 0 } }
    ]).toArray();
    expensive.forEach((book, i) => {
      console.log(`   ${i + 1}. "${book.title}" by ${book.author} - $${book.price}`);
    });

    console.log('\nSummary Statistics:');
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          averagePages: { $avg: '$pages' },
          booksInStock: { $sum: { $cond: ['$in_stock', 1, 0] } }
        }
      }
    ]).toArray();
    
    if (stats.length > 0) {
      const stat = stats[0];
      console.log(`   - Total Books: ${stat.totalBooks}`);
      console.log(`   - Average Price: $${stat.averagePrice.toFixed(2)}`);
      console.log(`   - Price Range: $${stat.minPrice} - $${stat.maxPrice}`);
      console.log(`   - Average Pages: ${Math.round(stat.averagePages)}`);
      console.log(`   - Books In Stock: ${stat.booksInStock}`);
      console.log(`   - Books Out of Stock: ${stat.totalBooks - stat.booksInStock}`);
    }

    console.log('\n=== ALL QUERIES COMPLETED SUCCESSFULLY ===\n');

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the queries
runQueries().catch(console.error);