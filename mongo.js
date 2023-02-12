const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://phonebook:${password}@cluster0.w5h7edt.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  
})

person.save().then(result => {
  console.log('person saved')
  mongoose.connection.close()
})