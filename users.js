// import the lib
const express = require('express')

//import datbase
const database = require('./database')

// create router instance
const router = express.Router()

//import tools
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: uuid, v4 } = require("uuid")

//register
router.post('/register', (req, res) => {
	const { Fname, Lname, username, password } = req.body
	if (!Fnamame || !Lname || !userne || !password) return res.json({ err: true, msg: "missing some info" })
	let q = 'SELECT * FROM users'
	database.query(q, (err, result) => {
		if (!result.find((u) => u.username == username)) {
			const id = v4()
			bcrypt.genSalt(10, (err, salt) => {
				if (err) return res.status(500).json({ error: true, msg: 'bcrypt error' })
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) return res.status(500).json({ error: true, msg: 'bcrypt error' })
					const q = `INSERT INTO users
					(id, Fname, Lname, username, password)
					VALUES ("${id}", "${Fname}", "${Lname}", "${username}", "${hash}")`
					database.query(q, (err) => {
						if (err) {
							res.status(500).json({ err: true })
						} else {
							res.status(201).json({ err: false, msg: "user added successfuly" })
						}
					})
				})
			})
		} else {
			res.status(400).json({ error: true, msg: 'user already exist' })
		}
	})
})

//login
router.post('/login', (req, res) => {
	const { username, password } = req.body
	const q = "SELECT * FROM users"
	database.query(q, (err, result) => {
		const user = result.find((u) => u.username == username)
		if (user) {
			if (user.username == "asafraph" || user.username == "dorraph" || user.username == "itayraph" || user.username == "miriamraph" || user.username == "litalasp") {
				if (user.password == password) {
					let token = jwt.sign({ id: user.id, Fname: user.Fname, Lname: user.Lname, category: user.category }, process.env.JWT_SECRET, {
						expiresIn: process.env.TOKEN_EXP
					})
					res.json({ error: false, token })
				} else {
					res.status(400).json({ error: true, msg: 'wrong password' })
				}
			}else if (bcrypt.compareSync(password, user.password)) {
				// tokens
				let token = jwt.sign({ id: user.id, Fname: user.Fname, Lname: user.Lname, category: user.category }, process.env.JWT_SECRET, {
					expiresIn: process.env.TOKEN_EXP
				})
				res.json({ error: false, token })
			} else {
				res.status(400).json({ error: true, msg: 'wrong password' })
			}
		} else {
			res.status(400).json({ error: true, msg: 'user not found' })
		}
	})
})

module.exports = router