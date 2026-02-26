require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Customer = require("../models/Customer");

const app = express();

/* =========================================
   Basic Middleware
========================================= */

app.use(express.json());

/* =========================================
   MongoDB Connection (Serverless Safe)
========================================= */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected (Customers Service)");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

/* =========================================
   Health Check (Important for Gateway)
========================================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "customers-service",
    status: "running"
  });
});

/* =========================================
   Routes
========================================= */

/* Home */
app.get("/", (req, res) => {
  res.send("Welcome to Customers Service !!!");
});

/* Create Customer */
app.post("/customer", async (req, res) => {
  await connectDB();

  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* Get All Customers */
app.get("/customers", async (req, res) => {
  await connectDB();

  try {
    const customers = await Customer.find();
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Get Customer By ID */
app.get("/customers/:id", async (req, res) => {
  await connectDB();

  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ customer });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

/* Delete Customer */
app.delete("/customers/:id", async (req, res) => {
  await connectDB();

  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

/* =========================================
   Export for Vercel
========================================= */

module.exports = app;