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

app.use(express.urlencoded({ extended: false}))
app.use(methodOveride(`_method`))
app.use(morgan(`dev`))
mongoose.connect(process.env.MONGODB_URI)


mongoose.connection.on(`connected`, () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})
//Boilerplate above
///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get(`/`, async (req, res) => {
    console.log(`pets home page`);
    res.render(`index.ejs`)
})














app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
    
})