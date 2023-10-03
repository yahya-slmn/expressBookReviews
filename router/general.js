const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // Retrieve the 'username' and 'password' from the request body
    const { username, password } = req.body;
  
    // Check if both 'username' and 'password' are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the 'username' is valid using the 'isValid' function
    
  
    // Check if the 'username' is already in use (you can replace this logic with your user database check)
    if (users.includes(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    // If 'username' is valid and not in use, you can add it to your user list (you can replace this logic with user registration in your database)
    users.push(username);
  
    return res.status(201).json({ message: "Registration successful." });
});
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;
  
    // Iterate through the properties of the 'books' object
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].ISBN === isbn) {
        // If a book with the specified ISBN is found, return its details as a JSON response
        return res.status(200).json(books[bookId]);
      }
    }
  
    // If the book is not found, return a 404 response
    return res.status(404).json({ message: "Book not found" });
});
  
  
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from request parameters
    const author = req.params.author;
  
    // Initialize an array to collect matching books
    const matchingBooks = [];
  
    // Iterate through the properties of the 'books' object
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
        // If the author matches, add the book to the matchingBooks array
        matchingBooks.push(books[bookId]);
      }
    }
  
    // Check if any matching books were found
    if (matchingBooks.length > 0) {
      // If matching books are found, return them as a JSON response
      return res.status(200).json(matchingBooks);
    } else {
      // If no matching books are found, return a 404 response
      return res.status(404).json({ message: "No books found by this author" });
    }
});
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from request parameters
    const title = req.params.title;
  
    // Initialize an array to collect matching books
    const matchingBooks = [];
  
    // Iterate through the properties of the 'books' object
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].title === title) {
        // If the title matches, add the book to the matchingBooks array
        matchingBooks.push(books[bookId]);
      }
    }
  
    // Check if any matching books were found
    if (matchingBooks.length > 0) {
      // If matching books are found, return them as a JSON response
      return res.status(200).json(matchingBooks);
    } else {
      // If no matching books are found, return a 404 response
      return res.status(404).json({ message: "No books found with this title" });
    }
});
  

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from request parameters
    const isbn = req.params.isbn;
  
    // Check if the book with the specified ISBN exists in the 'books' object
    if (books.hasOwnProperty(isbn)) {
      const bookReviews = books[isbn].reviews;
  
      // Return the book reviews as a JSON response
      return res.status(200).json({ reviews: bookReviews });
    } else {
      // If the book with the specified ISBN is not found, return a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
});

const axios = require('axios');

// Function to fetch the list of books using Axios and Promises
function getBooks() {
  return new Promise((resolve, reject) => {
    // Replace 'http://localhost:5000' with the actual URL of your server
    axios.get('http://localhost:5000/customer')
      .then((response) => {
        // If the request is successful, resolve with the book data
        resolve(response.data);
      })
      .catch((error) => {
        // If there's an error, reject with the error message
        reject(error.message);
      });
  });
}

// Usage example:
getBooks()
  .then((books) => {
    console.log('List of books:', books);
  })
  .catch((error) => {
    console.error('Error fetching books:', error);
  });

module.exports = {
  getBooks, // Export the getBooks function for external use
};


module.exports.general = public_users;
