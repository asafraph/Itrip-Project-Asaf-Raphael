// import the lib
const express = require('express')
const { v4 } = require('uuid')
const database = require('./database')

// import the verify middlewere
const { onlyRegisteredUser, onlyRegisteredAdmin } = require('./vt')

// create router instance
const router = express.Router()

router.get("/:id", (req, res)=>{
    const q = `SELECT  follow.user_id, vacations.id, vacations.city, vacations.country, vacations.image, vacations.departureDate, vacations.returnDate, vacations.price, vacations.followUsers, vacations.description
    FROM follow
    RIGHT JOIN vacations ON vacations.id = follow.vacation_id and user_id="${req.params.id}"
    ORDER BY follow.user_id desc;`
    database.query(q, (err, result)=>{
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({result})
        }
    })
})

router.post("/getid", (req, res)=>{
    const {userId, vacationId} = req.body
    const q = `SELECT id 
    FROM follow 
    WHERE user_id="${userId}" and vacation_id="${vacationId}"`
    database.query(q, (err, result)=>{
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({result})
        }
    })
})

//add record to follow table
router.post('/', (req, res)=>{
    const { userId, vacationId } = req.body
    const q = `INSERT INTO follow
    (user_id, vacation_id)
    VALUES ("${userId}", "${vacationId}")`
    database.query(q, (err, result)=>{
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({ result })
        }
    })
})

//updae follow users count at vacation table
router.put('/update/:id', (req, res)=>{
    const { followUsers } = req.body
    const q = `UPDATE vacations
    SET followUsers = ${followUsers}
    WHERE id = "${req.params.id}"`
    database.query(q, (err)=>{
        if (err) {
            res.status(500).json({ err: true, msg:err })
        } else {
            res.status(201).json({ err: false })
        }
    })
})

//delet record from follow table
router.put('/remove/:id', (req, res)=>{
    const q = `DELETE FROM follow WHERE id=${req.params.id}`
    database.query(q, err=>{
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({ err: false })
        }
    })
})

router.delete('/removevac/:id', onlyRegisteredAdmin, (req, res) => {
    const vacationId = req.params.id
    const q = `DELETE FROM follow WHERE vacation_id = "${vacationId}";`
    database.query(q, (err) => {
        if (err) {
            res.status(500).json({ err: true })
        } else {
            res.status(201).json({ err: false, msg: "vacation deleted successfuly" })
        }
    })
    
})


// export the middlewere
module.exports = router
