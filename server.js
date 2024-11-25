///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//boilerplate below


const dotenv = require(`dotenv`)
dotenv.config()
const express = require(`express`)
const mongoose = require(`mongoose`)
const methodOverride = require(`method-override`)
const morgan = require(`morgan`)
const app = express()
const PORT = 3001
const Pet = require(`./models/pet.js`)
const multer = require(`multer`)//working on getting images in the app
const path = require(`path`)

const storage = multer.diskStorage({////learning this from Docs and microsoft copilot.  trying to understand what I am doing with it.
    destination: (req, file, cb) => {
        cb(null, `uploads/`);//I dont know what these 2 functions do just yet. I know they come from the multer disk storage. 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride(`_method`))
app.use(morgan(`dev`))
app.use(`/uploads`, express.static(`uploads`))
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
app.post(`/pets`, upload.single(`image`), async (req, res) => {/// redirect back to pets page after adding. 
    const { name, typeOfAnimal, description } = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ``;
    const newPet = new Pet({ name, typeOfAnimal, imageUrl, description})
    await newPet.save()
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
app.put('/pets/:petId', upload.single('image'), async (req, res) => {
    const { name, typeOfAnimal, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.existingImageUrl;
    const updatedPet = { name, typeOfAnimal, imageUrl, description };
    await Pet.findByIdAndUpdate(req.params.petId, updatedPet);
    res.redirect(`/pets/${req.params.petId}`);
});

app.delete(`/pets/:petId`, async (req, res) => {
    await Pet.findByIdAndDelete(req.params.petId)
    res.redirect(`/pets`)
})






app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
    
})
// console.log(`test`);
// const { render } = require("ejs")