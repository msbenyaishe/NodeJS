const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()

/* ================= CORS FIX FOR VERCEL ================= */

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://atelier4-jwt-frontend.vercel.app"
  )
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }

  next()
})

/* ================= BODY PARSER ================= */

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ================= ENV CONFIG ================= */

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

/* ================= VERIFY TOKEN MIDDLEWARE ================= */

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || ""

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Access denied. Token required."
    })
  }

  const token = authHeader.split(" ")[1]

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

/* ================= EXPORT FOR VERCEL ================= */

module.exports = app