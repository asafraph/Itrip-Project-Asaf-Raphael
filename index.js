// import the lib
const express = require('express')

//import the port for heroku
const PORT = process.env.PORT || 1000
const cors = require('cors')
const path = require('path')

// config the env variables
require('dotenv').config()

// create server
const app = express()

// import the router files
const usersRouteFile = require('./users')
const vacationsRouteFile = require('./vacations')
const followRouteFile = require('./follow')

// middleweres
app.use(cors())
app.use(express.json())
app.use('/vacations', vacationsRouteFile)
app.use('/users', usersRouteFile)
app.use('/follow', followRouteFile)

// root route
app.get('/', (req, res) => {
	res.send('welcome to my vacations site =)')
})

//hosting
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
// run the server
app.listen(PORT, () => console.log(`run on port ${PORT}`))
