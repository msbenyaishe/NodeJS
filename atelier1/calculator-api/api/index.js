// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
let CalculRouter = express.Router();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Proper CORS Configuration
app.use(cors({
  origin: "*", // allow all origins (for learning purpose)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Explicitly handle preflight requests
app.options("*", cors());

// Response helper
function success(result) {
  return { status: 'success', result };
}

// Routes
CalculRouter.post('/somme', (req, res) => {
  let nb1 = req.body.n1;
  let nb2 = req.body.n2;
  let r = Number(nb1) + Number(nb2);
  res.json(success("la somme de " + nb1 + " et " + nb2 + " est : " + r));
});

CalculRouter.post('/produit', (req, res) => {
  let nb1 = req.body.n1;
  let nb2 = req.body.n2;
  let r = Number(nb1) * Number(nb2);
  res.json(success("le produit de " + nb1 + " et " + nb2 + " est : " + r));
});

// Route prefix
app.use("/api/v1/calculs", CalculRouter);

// Export for Vercel
module.exports = app;