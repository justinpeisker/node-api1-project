// BUILD YOUR SERVER HERE
const express = require('express')

const User = require('./users/model.js')

const server = express()

server.use(express.json())

server.post('/api/users', (req, res) => {

    const user = req.body
    if(!user.name || !user.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        User.insert(user)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err =>{
            res.status(500).json({ message: "There was an error while saving the user to the database" })
        })
    }
        
})

server.get('/api/users', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch (err) {
        res.status(500).json({message: "The users information could not be retrieved" })
    }
})

server.get('/api/users/:id', async (req,res) => {
   
    try{
        const { id } = req.params
        const user = await User.findById(id)
        if(!user) {
            res.status(404).json({ message: 'does not exist'})
        } else {
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})

server.delete('/api/users/:id', async (req, res) => {
        const user = await User.findById(req.params.id)
        
        if(!user){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        } else {
           const deletedUser = await User.remove(user.id)
            res.status(200).json(deletedUser)        
        }
})

server.put('/api/users/:id', async (req, res) => {

    const user = req.body
    try{
       const searchedUser = await User.findById(req.params.id) 
       if(!searchedUser){
            res.status(404).json({message: "The user with the specified ID does not exist" })
        } else {
            if(!user.name || !user.bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        
        }else {
            const updatedUser = await User.update(req.params.id, req.body)
           res.status(200).json(updatedUser)
       }}
    } catch (err) {
        res.status(500).json({message: "The user information could not be modified" })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
