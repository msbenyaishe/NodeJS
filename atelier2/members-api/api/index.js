const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const config = require('../config.json')
const { success, error } = require('../functions')

const app = express()

// Members array
let members = [
  { id: 1, name: 'PHP' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Java' }
]

// Router
let MembersRouter = express.Router()

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  next()
})

/* ================= ROUTES ================= */

// GET all members
MembersRouter.route('/')
  .get((req, res) => {
    res.json(success(members))
  })

// ADD new member
  .post((req, res) => {
    if (req.body.name) {

      let sameName = members.some(m => m.name === req.body.name)

      if (sameName) {
        res.json(error('name already taken'))
      } else {
        let member = {
          id: createID(),
          name: req.body.name
        }
        members.push(member)
        res.json(success(member))
      }

    } else {
      res.json(error('no name value'))
    }
  })

// GET / PUT / DELETE by ID
MembersRouter.route('/:id')

  .get((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      res.json(error(index))
    } else {
      res.json(success(members[index]))
    }
  })

  .put((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      res.json(error(index))
    } else {
      let same = members.some(
        m => m.name === req.body.name && m.id != req.params.id
      )

      if (same) {
        res.json(error('same name'))
      } else {
        members[index].name = req.body.name
        res.json(success(true))
      }
    }
  })

  .delete((req, res) => {
    let index = getIndex(req.params.id)

    if (typeof index === 'string') {
      res.json(error(index))
    } else {
      members.splice(index, 1)
      res.json(success(members))
    }
  })

/* ================= CONFIG ================= */

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

module.exports = app