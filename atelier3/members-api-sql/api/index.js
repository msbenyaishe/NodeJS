const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const { success, error } = require("../functions")

const app = express()

/* ================= MIDDLEWARE ================= */

app.use(express.json())

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}))

/* ================= DATABASE POOL ================= */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
})

/* ================= ROUTES ================= */

app.get("/api/v1/members", (req, res) => {

  db.query("SELECT * FROM members", (err, result) => {
    if (err) return res.json(error(err.message))
    res.json(success(result))
  })

})

app.post("/api/v1/members", (req, res) => {

  if (!req.body.name)
    return res.json(error("no name value"))

  db.query("SELECT * FROM members WHERE name = ?",
    [req.body.name],
    (err, result) => {

      if (err) return res.json(error(err.message))
      if (result.length > 0)
        return res.json(error("name already taken"))

      db.query(
        "INSERT INTO members(name) VALUES(?)",
        [req.body.name],
        (err, result) => {

          if (err) return res.json(error(err.message))

          res.json(success({
            id: result.insertId,
            name: req.body.name
          }))
        })
    })
})

app.get("/api/v1/members/:id", (req, res) => {

  db.query("SELECT * FROM members WHERE id = ?",
    [req.params.id],
    (err, result) => {

      if (err) return res.json(error(err.message))
      if (result.length === 0)
        return res.json(error("Wrong id"))

      res.json(success(result[0]))
    })
})

app.put("/api/v1/members/:id", (req, res) => {

  if (!req.body.name)
    return res.json(error("no name value"))

  db.query("SELECT * FROM members WHERE id = ?",
    [req.params.id],
    (err, result) => {

      if (err) return res.json(error(err.message))
      if (result.length === 0)
        return res.json(error("Wrong id"))

      db.query(
        "SELECT * FROM members WHERE name = ? AND id != ?",
        [req.body.name, req.params.id],
        (err, result) => {

          if (err) return res.json(error(err.message))
          if (result.length > 0)
            return res.json(error("same name"))

          db.query(
            "UPDATE members SET name = ? WHERE id = ?",
            [req.body.name, req.params.id],
            (err) => {

              if (err) return res.json(error(err.message))
              res.json(success("Updated successfully"))
            })
        })
    })
})

app.delete("/api/v1/members/:id", (req, res) => {

  db.query("SELECT * FROM members WHERE id = ?",
    [req.params.id],
    (err, result) => {

      if (err) return res.json(error(err.message))
      if (result.length === 0)
        return res.json(error("Wrong id"))

      db.query("DELETE FROM members WHERE id = ?",
        [req.params.id],
        (err) => {

          if (err) return res.json(error(err.message))
          res.json(success("Deleted successfully"))
        })
    })
})

module.exports = app