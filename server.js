///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//boilerplate below


const dotenv = require(`dotenv`)
dotenv.config()
const express = require(`express`)
const mongoose = require(`mongoose`)
const methodOveride = require(`method-override`)
const morgan = require(`morgan`)
const app = express()
const PORT = 3001
const Pet = require(`./models/pet.js`)
const { render } = require("ejs")

app.use(express.urlencoded({ extended: false}))
app.use(methodOveride(`_method`))
app.use(morgan(`dev`))
mongoose.connect(process.env.MONGODB_URI)


mongoose.connection.on(`connected`, () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})
//Boilerplate above
///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


///==Testing variables for routes
let home = `/`
let petsPage = `/pets`


///==Testing variables for routes



///home page
app.get(home, async (req, res) => {
    console.log(`pets home page`);
    res.render(`index.ejs`)
})
///pets page
app.get(petsPage, async (req, res) => { ////remember to give the pets page access to the database.
    const allPets = await Pet.find({})
    res.render(`pets/index.ejs`, {pets: allPets})
    console.log(`pets all page`);
    
})
///add pet page
app.get(`/pets/addPet`, async (req, res) => {
    // res.send(`add pet page`)
    res.render(`pets/addPet.ejs`)
})
//creating a pet function
app.post(`/pets`, async (req, res) => {/// redirect back to pets page after adding. 
    console.log(req.body)
    await Pet.create(req.body)
    res.redirect(`/pets`)
    
})

//show pet page
app.get(`/pets/:petId`, async (req, res) => {
    const foundPet = await Pet.findById(req.params.petId)
    res.render(`pets/show.ejs`, {pet: foundPet})
})
//edit pet page==================================
app.get(`/pets/:petId/updatePet`, async (req, res) => {
    const foundPet = await Pet.findById(req.params.petId)
    console.log(foundPet);
    res.render(`pets/updatePet.ejs`, {
        pet: foundPet,
    })

    // res.send(`edit the pet`)
})
app.put(`/pets/:petId`, async (req, res) => {
    await Pet.findByIdAndUpdate(req.params.petId, req.body)
    res.redirect(`/pets/${req.params.petId}`)
})
app.delete(`/pets/:petId`, async (req, res) => {
    await Pet.findByIdAndDelete(req.params.petId)
    res.redirect(`/pets`)
})






app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
    
})
// console.log(`test`);