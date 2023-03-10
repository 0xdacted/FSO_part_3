const mongoose = require('mongoose')

const phoneNumberValidator = (value) => {
  const regex = /^\d{2,3}-\d{6,7}$/
  return regex.test(value)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: phoneNumberValidator,
      message: 'Invalid phone number format. Example of a valid phone number: 09-1234566 or 040-22334455.'
    }
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