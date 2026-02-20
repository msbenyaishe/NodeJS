// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
let CalculRouter = express.Router();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

// IMPORTANT ROUTE PREFIX
app.use("/api/v1/calculs", CalculRouter);

// ❌ REMOVE app.listen
// ✅ EXPORT APP
module.exports = app;
