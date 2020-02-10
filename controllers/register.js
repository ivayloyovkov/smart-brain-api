const handleRegister = (req, res, bcrypt, db) => {
    const { email, name, password } = req.body;
    const validationReq = () => {
        check('email').isEmail();
        check('password').isLength({ min: 5 });
    }
    const errors = validationResult(validationReq);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const hash = bcrypt.hashSync(password, 8);
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