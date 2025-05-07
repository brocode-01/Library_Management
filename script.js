addsortButton();
let booksData = [];
let currentPage = 1;
let filteredBookMap = new Map();
const recordsPerPage = 10;
let count = 0;

async function fetchbook() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/chakshuujawa/json-hosting/refs/heads/main/books-v2.json");
        const data = await response.json();
        booksData = data;
        sortBooks();
        localStorage.setItem("booksData", JSON.stringify(booksData));
        displayPage(currentPage);
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

function displayPage(page) {
    try {
        const start = (page - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const paginatedBooks = booksData.slice(start, end);
        populateAllBooksTable(paginatedBooks);
        updatePaginationButtons();
        localStorage.setItem("booksData", JSON.stringify(booksData));
        localStorage.setItem("currentPage", page);
    } catch (err) {
        console.log("Error in display page", err);
    }
}

function populateAllBooksTable(books) {
    try {
        const tableBody = document.querySelector("#table-all-books tbody");
        tableBody.innerHTML = "";

        books.forEach((book) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                    <td>${book.bookId}</td>
                    <td>${book.genre}</td>
                    <td>${book.price}</td>
                    <td>${book.author}</td>
                    <td>${book.publicationYear}</td>
                    <td><img src="${book.coverImage}" alt="${book.bookName}" width="50"></td>
                `;

            tableBody.appendChild(row);
        });
    } catch (err) {
        console.log("Error in populate all books", err);
    }
}

function updatePaginationButtons() {
    try {
        const totalPages = Math.ceil(booksData.length / recordsPerPage);
        const paginationContainer = document.querySelector(".pagination");
        paginationContainer.innerHTML = "";
        const prevButton = document.createElement("li");
        prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevButton.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevButton.addEventListener("click", (event) => {
            if (currentPage > 1) {
                event.preventDefault();
                currentPage--;
                displayPage(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("li");
            pageButton.className = `page-item ${i === currentPage ? "active" : ""}`;
            pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageButton.addEventListener("click", (event) => {
                event.preventDefault();
                currentPage = i;
                displayPage(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement("li");
        nextButton.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
        nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextButton.addEventListener("click", (event) => {
            if (currentPage < totalPages) {
                event.preventDefault();
                currentPage++;
                displayPage(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    } catch (err) {
        console.log("Error in update page button", err);
    }
}

function addsortButton() {
    try {
        const Priceheader = document.getElementById("Priceheader");
        const Publicationheader = document.getElementById("Publicationheader");
        const PriceSortBtn = document.createElement("span");
        PriceSortBtn.innerHTML = `<i class="fa-solid fa-sort"></i>`;
        PriceSortBtn.setAttribute("data-sort", "null");
        Priceheader.appendChild(PriceSortBtn);
        const PublicationSortBtn = document.createElement("span");
        PublicationSortBtn.innerHTML = `<i class="fa-solid fa-sort"></i>`;
        PublicationSortBtn.setAttribute("data-sort", "null");
        Publicationheader.appendChild(PublicationSortBtn);
        PriceSortBtn.addEventListener("click", () => {
            toggleSort(PriceSortBtn, "price");
        });
        PublicationSortBtn.addEventListener("click", () => {
            toggleSort(PublicationSortBtn, "publicationYear");
        });
    } catch (err) {
        console.log("Error in add Sort Button", err);
    }
}

function toggleSort(button, key) {
    try {
        let order = button.getAttribute("data-sort");

        if (order === "null" || order === "desc") {
            booksData.sort((a, b) => a[key] - b[key]);
            order = "asc";
            button.setAttribute("data-sort", "asc");
        } else {
            booksData.sort((a, b) => b[key] - a[key]);
            order = "desc";
            button.setAttribute("data-sort", "desc");
        }
        localStorage.setItem("booksData", JSON.stringify(booksData));
        localStorage.setItem("sortKey", key);
        localStorage.setItem("sortOrder", order);
        currentPage = 1;
        displayPage(currentPage);
    } catch (err) {
        console.log("Error in Toggle Sort Button", err);
    }
}

document.getElementById("btn-search").addEventListener("click", () => {
    searchBooks();
    count = 0;
});

function searchBooks() {
    try {
        const tableBody = document.querySelector("#table-similar-books tbody");
        tableBody.innerHTML = "";
        clearExaminedBook();
        filteredBookMap.clear();
        let bookId = document.getElementById("input-search-id").value.trim();
        let genre = document
            .getElementById("input-search-genre")
            .value.trim()
            .toLowerCase();
        let priceMin = document.getElementById("input-search-price-min").value.trim();
        let priceMax = document.getElementById("input-search-price-max").value.trim();
        let author = document
            .getElementById("input-search-author")
            .value.trim()
            .toLowerCase();
        let publicationYear = document
            .getElementById("input-search-year")
            .value.trim();

        const searchFilters = {
            bookId,
            genre,
            priceMin,
            priceMax,
            author,
            publicationYear,
        };
        localStorage.setItem("searchFilters", JSON.stringify(searchFilters));

        if (
            !bookId &&
            !genre &&
            !priceMin &&
            !priceMax &&
            !author &&
            !publicationYear
        ) {
            alert("At least one search field must be filled.");
            return;
        }

        booksData.forEach((book) => {
            if (
                (bookId === "" || book.bookId.toString().includes(bookId)) &&
                (genre === "" || book.genre.toLowerCase().includes(genre)) &&
                (priceMin === "" || book.price >= parseFloat(priceMin)) &&
                (priceMax === "" || book.price <= parseFloat(priceMax)) &&
                (author === "" || book.author.toLowerCase().includes(author)) &&
                (publicationYear === "" ||
                    publicationYear === book.publicationYear.toString())
            ) {
                filteredBookMap.set(book.bookId, book);
            }
        });
        let filteredBookArray = Array.from(filteredBookMap.values());
        if (filteredBookArray.length > 0) {
            displayExaminedBook(filteredBookArray[0]);
        } else {
            clearExaminedBook();
        }
        let size = filteredBookArray.length;
        if (filteredBookArray.length > 1) {
            let remaningBooks = filteredBookArray.slice(1, size + 1);
            displaySimilarBook(remaningBooks);
        }
        if (filteredBookArray.length > 0) {
            moreSimilarBook(filteredBookArray[0]);
        }
    } catch (err) {
        console.log("Error in Search Books", err);
    }
}

function moreSimilarBook(book1) {
    try {
        let moreSimilar = [];
        const similarBook = booksData.filter(
            (b) =>
            b.genre === book1.genre &&
            b.bookId !== book1.bookId &&
            b.price >= book1.price * 0.9 &&
            b.price <= book1.price * 1.1
        );
        similarBook.forEach((b1) => {
            if (!filteredBookMap.has(b1.bookId)) {
                moreSimilar.push(b1);
            }
        });
        if (moreSimilar.length > 0) {
            displayMoreSimilarBooks(moreSimilar);
        }
    } catch (err) {
        console.log("Error in moreSimilarBook", err);
    }
}

function displayExaminedBook(book) {
    document.getElementById("book-id").textContent = book.bookId;
    document.getElementById("book-price").textContent = book.price;
    document.getElementById("book-genre").textContent = book.genre;
    document.getElementById("book-author").textContent = book.author;
    document.getElementById("book-year").textContent = book.publicationYear;
}

function displaySimilarBook(book) {
    try {
        const tableBody = document.querySelector("#table-similar-books tbody");
        tableBody.innerHTML = "";
        book.forEach((bk) => {
            count++;
            if (count <= 10) {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${bk.bookId}</td>
        <td>${bk.genre}</td>
        <td>${bk.price}</td>
        <td>${bk.author}</td>
        <td>${bk.publicationYear}</td>
        <td><img src="${bk.coverImage}" alt="${bk.bookName}" width="50"></td>
        `;
                tableBody.appendChild(row);
            }
        });
    } catch (err) {
        console.log("Error in display Similar Books", err);
    }
}

function displayMoreSimilarBooks(book) {
    try {
        const tableBody = document.querySelector("#table-similar-books tbody");
        book.forEach((bk) => {
            count++;
            if (count <= 10) {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td>${bk.bookId}</td>
        <td>${bk.genre}</td>
        <td>${bk.price}</td>
        <td>${bk.author}</td>
        <td>${bk.publicationYear}</td>
        <td><img src="${bk.coverImage}" alt="${bk.bookName}" width="50"></td>
        `;
                tableBody.appendChild(row);
            }
        });
    } catch (err) {
        console.log("Error in display More Similar Book", err);
    }
}

function clearExaminedBook() {
    document.getElementById("book-id").textContent = "";
    document.getElementById("book-price").textContent = "";
    document.getElementById("book-genre").textContent = "";
    document.getElementById("book-author").textContent = "";
    document.getElementById("book-year").textContent = "";
}
document.addEventListener("DOMContentLoaded", () => {
    try {
        const savedBooksData = localStorage.getItem("booksData");
        const savedCurrentPage = localStorage.getItem("currentPage");
        const savedFilters = JSON.parse(localStorage.getItem("searchFilters")) || {};

        if (savedBooksData) {
            booksData = JSON.parse(savedBooksData);
            sortBooks();
        } else {
            fetchbook();
        }
        currentPage = savedCurrentPage ? parseInt(savedCurrentPage) : 1;
        displayPage(currentPage);

        if (Object.values(savedFilters).some((value) => value.trim() !== "")) {
            restoreSearchFilters(savedFilters);
            searchBooks();
        }
    } catch (err) {
        console.log("Error in DOM LOAD", err);
    }
});

function restoreSearchFilters(filters) {
    document.getElementById("input-search-id").value = filters.bookId || "";
    document.getElementById("input-search-genre").value = filters.genre || "";
    document.getElementById("input-search-price-min").value = filters.priceMin || "";
    document.getElementById("input-search-price-max").value = filters.priceMax || "";
    document.getElementById("input-search-author").value = filters.author || "";
    document.getElementById("input-search-year").value = filters.publicationYear || "";
}

function sortBooks() {
    const savedSortKey = localStorage.getItem("sortKey");
    const savedSortOrder = localStorage.getItem("sortOrder");

    if (savedSortKey && savedSortOrder) {
        booksData.sort((a, b) =>
            savedSortOrder === "asc" ?
            a[savedSortKey] - b[savedSortKey] :
            b[savedSortKey] - a[savedSortKey]
        );
    }
}