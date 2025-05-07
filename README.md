# Library_Management
📚 Book Data Manager
A JavaScript-based application that generates, stores, and manages a list of 100 randomly generated books with advanced search, sorting, pagination, and similarity recommendations. The app uses Local Storage for persistence and supports both Promises and Async/Await versions of asynchronous code.

🔧 Features<br>
✅ Generate & Store Book Data
Generates 100 random books (with bookId, genre, price, author, publicationYear)

Saves the generated book list in JSON format

Emulates storage in AWS S3 using Local Storage

🔍 Advanced Search
Filter by:

bookId

genre

author (supports partial matches like "J.K." → "J.K. Rowling")

publicationYear

price range

📊 Sorting & Pagination
Sort by:

price (ascending/descending)

publicationYear (ascending/descending)

Pagination:

10 books per page

Page navigation support

📖 Book Details
Detailed view of:

author

publicationYear

Recommends similar books based on:

Same genre

Price range ±10%

💾 Data Persistence
Book data is stored in Local Storage

Data survives after page refresh or browser restart

🚨 Error Handling
Graceful handling of:

JSON file read/write issues

Invalid input/search criteria

🕰 Async Implementations

One using Async/Await
