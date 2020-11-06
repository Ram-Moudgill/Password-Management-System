const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Passwordmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
})
const passSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
const passModel = mongoose.model('password', passSchema)

module.exports = passModel
