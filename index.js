//  Book class - object
class Book {
	constructor(title, author, isbn){
		this.author = author;
		this.title = title;
		this.isbn = isbn;
	}
}

//ui class: UI tasks
class UI {
	static displayBooks(){
		
		const books = Store.getBooks();

		books.forEach(book=> UI.addBookToList(book));
	}
	static addBookToList(book){
		const list = document.querySelector("#book-list");

		const row = document.createElement("tr");

		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;
		list.appendChild(row);
	}
	static clearFields(){
		var title = document.querySelector("#title");
		var author = document.querySelector("#author");
		var isbn = document.querySelector("#isbn");
		title.value = '';
		author.value = '';
		isbn.value = '';
	}
	static showAlert(message, className){
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector(`.container`);
		const form = document.querySelector(`#book-form`);
		container.insertBefore(div, form);
		setTimeout(() => document.querySelector('.alert').remove(), 3000)
	}
}

//Store class - storage
class Store {
	static getBooks(){
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		}else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}
	static addBook(book){
		const books = Store.getBooks();
		console.log("books: " + books);
		books.push(book);

		localStorage.setItem("books", JSON.stringify(books));
	}
	static removeBook(isbn){
		const books = Store.getBooks();
		books.forEach((book,index) => {
			if(book.isbn === isbn){
				books.splice(index, 1);
			}
		})
		localStorage.setItem("books", JSON.stringify(books));
	}
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: add book
document.querySelector("#book-form").addEventListener('submit', (e)=>{
	e.preventDefault();
	const title = e.target[0].value
	const author = e.target[1].value
	const isbn = e.target[2].value
	//validate

	if(title === '' || author === '' || isbn === ''){
		UI.showAlert('invalid field value', 'danger');
	}else{
		var book = new Book(title, author, isbn);
		UI.clearFields();
		UI.addBookToList(book)
		UI.showAlert('Book Added', "success");
		Store.addBook(book);
	}
})
// Remove book
document.querySelector("#book-list").addEventListener('click', e => {
	if(e.target.classList.contains("delete")){
		var isbn = e.target.parentNode.parentNode.children[2].innerText;
		console.log(isbn);
		Store.removeBook(isbn);
		e.target.parentNode.parentNode.remove();
		UI.showAlert('Book Removed', "success");
	}
})