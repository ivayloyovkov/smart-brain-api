const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const knex = require('knex');
const { celebrate, Joi, errors, Segments } = require('celebrate');

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
app.post('/register', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }),
}), (req, res) => { register.handleRegister(req, res, bcrypt, db) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })
app.use(errors());
app.listen(process.env.PORT, () => {

});