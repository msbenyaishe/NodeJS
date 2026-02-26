var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var Order = require("../models/Order");

var app = express();
app.use(express.json());

/* ============================= */
/* MongoDB Connection */
/* ============================= */

mongoose.connect(process.env.MONGO_URI)
.then(function () {
    console.log("MongoDB Connected");
})
.catch(function (err) {
    console.log("Mongo Error:", err);
});

/* ============================= */
/* Routes */
/* ============================= */

app.get("/", function (req, res) {
    res.send("Welcome to Orders Service !!!");
});

/* Add new order */
app.post("/order", async function (req, res) {
    try {
        var newOrder = new Order({
            CustomerID: req.body.CustomerID,
            BookID: req.body.BookID,
            initialDate: req.body.initialDate,
            deliveryDate: req.body.deliveryDate
        });

        await newOrder.save();

        res.json({ message: "A new order added !!!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* Get all orders */
app.get("/orders", async function (req, res) {
    try {
        var orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* Get enriched order */
app.get("/order/:id", async function (req, res) {
    try {
        var order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        /* Call other microservices */
        var customerResponse = await axios.get(
            process.env.CUSTOMER_SERVICE_URL + "/" + order.CustomerID
        );

        var bookResponse = await axios.get(
            process.env.BOOK_SERVICE_URL + "/" + order.BookID
        );

        res.json({
            order: {
                customerName: customerResponse.data.name,
                bookTitle: bookResponse.data.title,
                initialDate: order.initialDate,
                deliveryDate: order.deliveryDate
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;