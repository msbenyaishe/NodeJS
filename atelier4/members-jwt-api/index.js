const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const app = express()

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://atelier4-jwt-api.vercel.app"
  ]
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ================= ENV CONFIG ================= */

const PORT = process.env.PORT || 5000
const SECRET = process.env.JWT_SECRET || "members_secret_key"

/* ================= TEST USER ================= */

const testUser = {
  id: 1,
  username: "msbenyaishe",
  password: "said2005"
}

/* ================= FAKE DATABASE ================= */

let members = [
  { id: 1, name: "Mohamed Said", email: "mohamedsaidbenyaiche@gmail.com" },
  { id: 2, name: "Ahmed Aji", email: "ahmedaji@gmail.com" }
]

/* ================= LOGIN ROUTE ================= */

app.post("/api/login", (req, res) => {
  const { username, password } = req.body

  if (
    username === testUser.username &&
    password === testUser.password
  ) {
    const user = {
      id: testUser.id,
      username: testUser.username
    }

    const token = jwt.sign({ user }, SECRET, {
      expiresIn: "1h"
    })

    return res.status(200).json({ token })
  }

  return res.status(401).json({
    message: "Invalid credentials"
  })
})

/* ================= VERIFY TOKEN ================= */

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization || ""

  if (!bearerHeader) {
    return res.status(403).json({
      message: "Access denied. Token required."
    })
  }

  const token = bearerHeader.split(" ")[1]

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token."
      })
    }

    req.user = decoded.user
    next()
  })
}

/* ================= PROTECTED ROUTES ================= */

// GET all members
app.get("/api/members", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Members list",
    user: req.user,
    result: members
  })
})

// CREATE member
app.post("/api/members", verifyToken, (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    })
  }

  const newMember = {
    id: members.length + 1,
    name,
    email
  }

  members.push(newMember)

  res.status(201).json({
    message: "Member created successfully",
    result: newMember
  })
})

// UPDATE member
app.put("/api/members/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  const member = members.find(m => m.id === id)

  if (!member) {
    return res.status(404).json({
      message: "Member not found"
    })
  }

  if (name) member.name = name
  if (email) member.email = email

  res.status(200).json({
    message: "Member updated successfully",
    result: member
  })
})

// DELETE member
app.delete("/api/members/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id)

  const index = members.findIndex(m => m.id === id)

  if (index === -1) {
    return res.status(404).json({
      message: "Member not found"
    })
  }

  const deletedMember = members.splice(index, 1)

  res.status(200).json({
    message: "Member deleted successfully",
    result: deletedMember[0]
  })
})

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." })
})

/* ================= START SERVER ================= */

module.exports = app