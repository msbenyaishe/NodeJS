const mongoose = require("mongoose");

/*
  Customer Schema
  - name: required string
  - email: required string
*/

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

/*
  Prevent model overwrite in serverless environments
*/
module.exports =
  mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);