
/* Remember to use 'strict' mode in all scripts now! 
You can use strict mode in all your programs. It helps you to write cleaner code, 
like preventing you from using undeclared variables. (https://www.w3schools.com/js/js_strict.asp) */

"use strict";

//*********************************
//** Project: Book Warehouse
//*********************************

//** Class Definitions
//*********************************

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//**  UI Class
//*********************************

class UI {

  static showBooks() {
      const books = BookData.getBooks();
      books.forEach((book) => UI.addBookToList(book))
  }

  static addBookToList(book) {
    const lista = document.querySelector('#book-list');

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete" title="Remove / Borrar" style="border-radius: .2rem;">X</a></td>
    `;

    lista.appendChild(fila);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }

  }
  

//* Show alert
  static showAlert(mensaje, className) {
    const div = document.createElement('div');
    div.className =`alert alert-${className}`;
    div.appendChild(document.createTextNode(mensaje));
    //https://getbootstrap.com/docs/5.0/components/alerts/

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(()=>document.querySelector('.alert').remove(), 3000);
  }

//* Clear input field
 static clearField() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';

  }
}

//* Book management (add / remove)
//*********************************

class BookData {

  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;

  }

  static addBook(book) {
    const books = BookData.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

  }

  static removeBook(isbn) {
    const books = BookData.getBooks();

    books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
    });
    localStorage.setItem('books', JSON.stringify(books));

  }
}

//** Page events (Loading page)
document.addEventListener('DOMContentLoaded', UI.showBooks());
//https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

//** Handle form event  (Submit)
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  //https://www.w3schools.com/jsref/event_preventdefault.asp



//** Get field values 
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please enter the book data | Por favor ingrese todos los datos', 'danger')

  } else {
    const book = new Book(title, author, isbn);
    BookData.addBook(book);
    //Para mostrar book cargado en la lista de la  pagina
    UI.addBookToList(book);
    UI.showAlert('Book added to collection | Libro agregado a la colección', 'success')
    //Limpiar campos
    UI.clearField();
  }

});

//** Event to remove book from list and from web local storage 
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  BookData.removeBook(e.target.parentElement.previousElementSibling.textContent)
});