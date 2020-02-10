const handleSignin = (req, res, bcrypt, db) => {
    db.select('email', 'hashedpass').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hashedpass);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('No user is registered with this email.'))
            } else {
                res.status(400).json('Wrong email or password')
            }
        })
        .catch(err => res.status(400).json('Wrong email or password'))
}

module.exports = {
    handleSignin
}