const { check, validationResult } = require('express-validator');

const handleRegister = (req, res, bcrypt, db) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);

    if (!check('email').isEmail()) {
        return res.status(400).json('Invalid Email')
    } else if (!check('password').isLength({ min: 6 })) {
        return res.status(400).json('Password must be at least 6 characters')
    }

    db.transaction(trx => {
        trx.insert({
                hashedpass: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
                    .then(trx.commit)
                    .catch(trx.callback)
            })
            .catch(err => res.status(400).json('Unable to register'));
    })
}

module.exports = {
    handleRegister
}