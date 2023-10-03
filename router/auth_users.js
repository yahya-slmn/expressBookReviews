const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username) => {
  // You can use regular expressions or any custom logic to validate the username
  // For example, allowing only alphanumeric characters, underscores, and hyphens:
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  return validUsernameRegex.test(username);
}

const authenticatedUser = (username, password) => {
  // Find the user with the matching 'username'
  const user = users.find((user) => user.username === username);

  // Check if a user with the provided 'username' exists
  if (!user) {
    return false; // User not found
  }

  // Check if the 'password' matches the stored password for the user
  if (user.password === password) {
    return true; // Authentication successful
  }

  return false; // Incorrect password
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  // Retrieve the 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Check if both 'username' and 'password' are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the 'username' is valid (use the 'isValid' function)
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format." });
  }

  // Check if the provided username and password match the ones in your records (use the 'authenticatedUser' function)
  if (authenticatedUser(username, password)) {
    // Generate a JWT token for the user
    const token = jwt.sign({ username }, "your_secret_key_here", { expiresIn: "1h" });

    // Return the token as a response, along with a success message
    return res.status(200).json({ message: "Login successful.", token });
  } else {
    // If the credentials are invalid, return a 401 (Unauthorized) response
    return res.status(401).json({ message: "Invalid credentials." });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Retrieve the 'isbn' from request parameters and 'review' from the request body
    const { isbn } = req.params;
    const { review } = req.body;
  
    // Check if the user is authenticated and their username is stored in the session
    if (req.session.authorization) {
      const username = req.session.authorization.username;
  
      // Check if the book with the specified 'isbn' exists in the 'books' object
      if (books.hasOwnProperty(isbn)) {
        // Check if the user has already posted a review for this book (based on ISBN)
        const existingReviewIndex = books[isbn].reviews.findIndex(
          (userReview) => userReview.username === username
        );
  
        if (existingReviewIndex !== -1) {
          // If the user has already posted a review, update their existing review
          books[isbn].reviews[existingReviewIndex].review = review;
        } else {
          // If the user has not posted a review for this book, add a new review entry
          books[isbn].reviews.push({ username, review });
        }
  
        // Return a success message
        return res.status(200).json({ message: "Review added/modified successfully." });
      } else {
        // If the book with the specified 'isbn' is not found, return a 404 response
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      // If the user is not authenticated, return a 403 (Forbidden) response
      return res.status(403).json({ message: "User not authenticated" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the 'isbn' from request parameters
    const { isbn } = req.params;
  
    // Check if the book with the specified 'isbn' exists in the 'books' object
    if (books.hasOwnProperty(isbn)) {
      // Filter the reviews for the book, excluding the reviews from the current user
      books[isbn].reviews = books[isbn].reviews.filter(
        (review) => review.username !== req.user.username
      );
  
      // Return a success message
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      // If the book with the specified 'isbn' is not found, return a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

