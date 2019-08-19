const express = require('express');
const bcrypt = require('bcryptjs')

const Users = require('./data-model');
const restricted = require('./middleware');
const router = express.Router();

router.post('/register', (req,res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 12)

    newUser.password = hash;

    Users.add(newUser)
        .then(added => {
            res.status(201).json('New user has been added to the database')
        })
        .catch(err => {
            res.status(400).json({ error: "New user can't be added to the database" })
        })
})


router.post('/login', (req,res) => {
    const {username, password} = req.body;

    Users.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({ message: 'Welcome'})    
            }else{
                res.status(401).json({ error: 'Invalid credentials' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})


router.get('/users', restricted, (req,res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ error: 'Couldnt get list of users from the database' })
        })

})


module.exports = router;
