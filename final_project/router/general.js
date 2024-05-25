const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js"); 
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/',function (req, res) {
  return res.json(books);
});

public_users.get("/register", (req,res) => {
  //Write your code here
  const {username,password} =req.body;
  if(!username || !password){
    return res.status(400).json({message:"User and Password are required"});
  }
  if(isValid(username)){
    return res.status(400).json({message:"Username already exists"});
  }
  users.push((username,password));
  return res.status(201).json({message: "user registered successfully"});
});
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  const book=books[isbn];
  if(book){
    return res.json(books);
  }
  else{
      return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  const booksByAuthor=Object.values(books).filter(book=>book.author===author);
  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code 
  const title=req.params.title;
  const booksByTitle=Object.values(books).filter(book=>book.title===title);
  return res.json(booksByTitle);
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  const book=books[isbn];
  if(book){
    return res.json(book.reviews);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});
// Task 10:
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch book list" });
    }
});

// Task 11: 
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 12: 
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by author" });
    }
});

// Task 13:
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by title" });
    }
});

public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});
module.exports.general = public_users;
