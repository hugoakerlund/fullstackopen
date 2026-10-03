const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })



const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        if (v.length < 8) { return false }

        let parts = v.split('-')
        if (parts.length != 2) { return false }

        let first = parts[0];
        let second = parts[1];
        if (first.length < 2 || first.length > 3) { return false }

        return /^\d+$/.test(first) && /\^\d+$/.test(second);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
