const handleSignin = (req, res, bcrypt, db) => {
    db.select('email', 'hashedPass').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hashedPass);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong username or password')
            }
        })
        .catch(err => res.status(400).json('Wrong username or password'))
}

module.exports = {
    handleSignin
}