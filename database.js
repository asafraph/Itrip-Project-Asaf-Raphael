const { default: uuid, v4 } = require("uuid")

const mysql = require('mysql')

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'vacations',
})

con.connect( (err)=> {
	if (err) {
		console.log('error connecting: ' + err.stack)
		return
	}
	console.log('connected to mysql')
})

module.exports = con



