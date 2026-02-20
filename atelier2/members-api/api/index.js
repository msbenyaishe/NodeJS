const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const config = require('../config.json')
const { success, error } = require('../functions')

const app = express()

/* ================= MIDDLEWARES ================= */

// Logger
app.use(morgan('dev'))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS (IMPORTANT)
app.use(cors({
  origin: ["http://localhost:5173"], // your React dev server
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}))

// Handle preflight requests
app.options('*', cors())

/* ================= DATA ================= */

let members = [
  { id: 1, name: 'Mohamed Said' },
  { id: 2, name: 'Houdaifa' },
  { id: 3, name: 'Mostafa' }
]

/* ================= ROUTER ================= */

let MembersRouter = express.Router()

// GET all members
MembersRouter.route('/')
  .get((req, res) => {
    res.json(success(members))
  })

  // ADD new member
  .post((req, res) => {

    if (!req.body.name) {
      return res.json(error('no name value'))
    }

    let sameName = members.some(m => m.name === req.body.name)

    if (sameName) {
      return res.json(error('name already taken'))
    }

    let member = {
      id: createID(),
      name: req.body.name
    }

    members.push(member)

    res.json(success(member))
  })

// GET / PUT / DELETE by ID
MembersRouter.route('/:id')

  .get((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      return res.json(error(index))
    }

    res.json(success(members[index]))
  })

  .put((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      return res.json(error(index))
    }

    let same = members.some(
      m => m.name === req.body.name && m.id != req.params.id
    )

    if (same) {
      return res.json(error('same name'))
    }

    members[index].name = req.body.name

    res.json(success(true))
  })

  .delete((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      return res.json(error(index))
    }

    members.splice(index, 1)

    res.json(success(members))
  })

/* ================= ROUTE PREFIX ================= */

app.use(config.rootAPI + 'members', MembersRouter)

/* ================= FUNCTIONS ================= */

function getIndex(id) {
  for (let i = 0; i < members.length; i++) {
    if (members[i].id == id) return i
  }
  return 'wrong id'
}

function createID() {
  return members[members.length - 1].id + 1
}

/* ================= EXPORT ================= */

module.exports = app