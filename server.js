const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const knex = require('knex');
const { check, validationResult } = require('express-validator');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json(db.users) })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, bcrypt, db) })
app.post('/register', [
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
], (req, res) => { register.handleRegister(req, res, bcrypt, db, validationResult) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })
app.listen(process.env.PORT, () => {

});


app.post('/signup', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        age: Joi.number().integer(),
        role: Joi.string().default('admin')
    }),
    [Segments.QUERY]: {
        token: Joi.string().token().required()
    }
}), (req, res) => {
    // At this point, req.body has been validated and 
    // req.body.role is equal to req.body.role if provided in the POST or set to 'admin' by joi
});
app.use(errors());