const jwt = require('jsonwebtoken')


const onlyRegisteredUser = (req, res, next) => {
	jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
            res.status(401).json({ error: true, msg: err })
		} else {
            req.user = decoded
            if(req.user.category=="user"){
                next()
            }else{
                res.status(401).json({ error: true, msg: "no authority" })
            }
		}
	})
}
const onlyRegisteredAdmin = (req, res, next) => {
	jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
            res.status(401).json({ error: true, msg: err })
		} else {
            req.user = decoded
            if(req.user.category=="admin"){
                next()
            }else{
                res.status(401).json({ error: true, msg: "no authority" })
            }
		}
	})
}

module.exports = { onlyRegisteredUser, onlyRegisteredAdmin }
