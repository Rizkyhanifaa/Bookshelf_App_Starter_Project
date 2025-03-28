document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchForm = document.getElementById("searchBook");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    let books = JSON.parse(localStorage.getItem("books")) || [];
  
    function saveBooks() {
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    function renderBooks(filter = "") {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
      books.forEach((book) => {
        if (book.title.toLowerCase().includes(filter.toLowerCase())) {
          const bookElement = createBookElement(book);
          book.isComplete
            ? completeBookList.appendChild(bookElement)
            : incompleteBookList.appendChild(bookElement);
        }
      });
    }
  
    function createBookElement(book) {
      const bookContainer = document.createElement("div");
      bookContainer.setAttribute("data-bookid", book.id);
      bookContainer.setAttribute("data-testid", "bookItem");
  
      bookContainer.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="book-action">
          <button class="btn-green" data-testid="bookItemIsCompleteButton">${
            book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
          }</button>
          <button class="btn-red" data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button class="btn-yellow" data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;
  
      bookContainer
        .querySelector("[data-testid='bookItemIsCompleteButton']")
        .addEventListener("click", () => toggleBookStatus(book.id));
  
      bookContainer
        .querySelector("[data-testid='bookItemDeleteButton']")
        .addEventListener("click", () => deleteBook(book.id));
  
      bookContainer
        .querySelector("[data-testid='bookItemEditButton']")
        .addEventListener("click", () => editBook(book.id));
  
      return bookContainer;
    }
  
    function addBook(title, author, year, isComplete) {
      const book = {
        id: new Date().getTime(),
        title,
        author,
        year: parseInt(year),
        isComplete,
      };
      books.push(book);
      saveBooks();
      renderBooks();
    }
  
    function toggleBookStatus(id) {
      books = books.map((book) =>
        book.id === id ? { ...book, isComplete: !book.isComplete } : book
      );
      saveBooks();
      renderBooks();
    }
  
    function deleteBook(id) {
      books = books.filter((book) => book.id !== id);
      saveBooks();
      renderBooks();
    }
  
    function editBook(id) {
      const book = books.find((b) => b.id === id);
      if (book) {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
        deleteBook(id);
      }
    }
  
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = document.getElementById("bookFormYear").value;
      const isComplete = document.getElementById("bookFormIsComplete").checked;
      addBook(title, author, year, isComplete);
      bookForm.reset();
    });
  
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchValue = document.getElementById("searchBookTitle").value;
      renderBooks(searchValue);
    });
  
    renderBooks();
  });