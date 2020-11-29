const { default: uuid, v4 } = require("uuid")

const mysql = require('mysql')

const con = mysql.createConnection({
	host: 'us-mm-auto-sfo-02-bh.cleardb.net',
	user: 'bb0f1923690c75',
	password: '5792799d',
	database: 'heroku_6c24fc72a58f31d',
})

con.connect( (err)=> {
	if (err) {
		console.log('error connecting: ' + err.stack)
		return
	}
	console.log('connected to mysql')
})

module.exports = con



