const { check, validationResult } = require('express-validator');

const handleRegister = (req, res, bcrypt, db) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const errors = validationResult(req);
    check('email').isEmail();
    check('password').isLength({ min : 6});
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
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