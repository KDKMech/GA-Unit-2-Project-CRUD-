const mongoose = require(`mongoose`)

const petSchema = new mongoose.Schema({
    name: String,
    typeOfAnimal: String,
    imageUrl: String,  //maybe. I need to figure out how first. copilot says Multer. will need to look into this.
    description: String,
})
const Pet = mongoose.model(`Pet`, petSchema)


module.exports = Pet