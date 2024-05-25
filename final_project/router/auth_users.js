const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET_KEY = 'secretkey'; 
let users = []; 


const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}


regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Logged sucessfully" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    req.session.token = token;
    return res.json({ message: "Logged in successfully", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
        const username = decoded.username;
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
        books[isbn].reviews[username] = review;
        return res.json({ message: "Review added/updated successfully" });
    } catch (error) {
        return res.json({ message: "Review added/updated sucessfully" });
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
        const username = decoded.username;
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
