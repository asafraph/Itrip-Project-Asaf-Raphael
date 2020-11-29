// import the lib
const express = require('express')
const { v4 } = require('uuid')
const database = require('./database')

// // import the DB
// const { vacations } = require('./database')

// import the verify middlewere
const { onlyRegisteredUser, onlyRegisteredAdmin } = require('./vt')

// create router instance
const router = express.Router()

router.get('/', (req, res) => {
    const q = 'SELECT * FROM vacations'
    database.query(q, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ err: true })
        } else {
            res.status(201).json(result)
        }
    })
})

router.get('/:id', (req, res) => {
    const q = `SELECT * FROM vacations
               WHERE id="${req.params.id}"`
    database.query(q, (err, result) => {
        if (err) {
            console.log("nope")
            res.status(500).json({ err: true })
        } else {
            res.status(201).json(result)
        }
    })
})

router.post('/add', onlyRegisteredAdmin, (req, res) => {
    const { city, country, image, departureDate, returnDate, description, price } = req.body
    if (!city || !country || !departureDate || !returnDate || !description || !price) return res.json({ err: true, msg: "missing some info" })
    const id = v4()
    const q = `INSERT INTO vacations
    (id, city, country, image, departureDate, returnDate, price, description)
    VALUES ("${id}", "${city}", "${country}", "${image}", "${departureDate}", "${returnDate}", "${price}", "${description}")`
    database.query(q, (err) => {
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({ err: false, msg: "user added successfuly" })
        }
    })
})

router.put('/update/:id', onlyRegisteredAdmin, (req, res) => {
    const vacationId = req.params.id
    const { city, country, image, departureDate, returnDate, description, price } = req.body
    if (!city || !country || !departureDate || !returnDate || !description || !price) return res.json({ err: true, msg: "missing some info" })
    const q = `UPDATE vacations
    SET city = "${city}", country = "${country}", image = "${image}", departureDate = "${departureDate}", returnDate = "${returnDate}", description = "${description}", price = ${price}
    WHERE id = "${vacationId}";`
    database.query(q, (err) => {
        if (err) {
            res.status(500).json({ err: true, msg:err })
        } else {
            res.status(201).json({ err: false, msg: "vacation updated successfuly" })
        }
    })
})

router.delete('/remove/:id', onlyRegisteredAdmin, (req, res) => {
    const vacationId = req.params.id
    const q1 = `DELETE FROM follow WHERE vacation_id = "${vacationId}";`
    database.query(q1, (err) => {
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({ err: false, msg: "vacation deleted successfuly" })
        }
    })
    const q = `DELETE FROM vacations WHERE id = "${vacationId}";`
    database.query(q, (err) => {
        if (err) {
    //         res.status(500).json({ err: true })
        } else {
    //         res.status(201).json({ err: false, msg: "vacation deleted successfuly" })
        }
    })
})


// export the middlewere
module.exports = router
