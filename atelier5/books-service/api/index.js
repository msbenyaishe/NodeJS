// Load environment variables
require("dotenv").config();

// Import modules
const express = require("express");
const mongoose = require("mongoose");

// Import Book model
const Book = require("../models/Book");

// Create Express app
const app = express();

/* =====================================================
   1️⃣ BASIC MIDDLEWARE
   ===================================================== */

// Parse JSON request bodies
app.use(express.json());

/*
   IMPORTANT:
   We DO NOT configure strict CORS here because:

   - This service is part of a microservices system
   - It should be accessed via API Gateway
   - Not directly by the browser

   If needed, API Gateway handles CORS.
*/


/* =====================================================
   2️⃣ MONGODB CONNECTION (SERVERLESS SAFE)
   ===================================================== */

/*
   In serverless environments (like Vercel),
   functions can execute multiple times.

   To avoid reconnecting to MongoDB every time,
   we cache the connection.
*/

let isConnected = false;

async function connectDB() {

  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);

    isConnected = db.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected (Books Service)");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}


/* =====================================================
   3️⃣ ROUTES (BOOKS SERVICE)
   ===================================================== */

/*
   This service only handles book-related logic.
   No auth logic.
   No frontend logic.
   No gateway logic.
*/

/* Health Check Route (Very Important for Microservices) */
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "books-service",
    status: "running"
  });
});


/* Home Route */
app.get("/", (req, res) => {
  res.send("Books Service is running");
});


/* CREATE Book */
app.post("/book", async (req, res) => {

  await connectDB();

  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/* GET All Books */
app.get("/books", async (req, res) => {

  await connectDB();

  try {
    const books = await Book.find();
    res.json(books);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* GET Book By ID */
app.get("/books/:id", async (req, res) => {

  await connectDB();

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);

  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});


/* DELETE Book */
app.delete("/books/:id", async (req, res) => {

  await connectDB();

  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});


/* =====================================================
   4️⃣ EXPORT HANDLER (VERCEL SERVERLESS)
   ===================================================== */

/*
   No app.listen() here.

   Vercel automatically creates the server.
*/

module.exports = app;