const express = require('express')
const app = express()
//port
const PORT = process.env.PORT || 5000
// requirng routes
const router = require('./routes/routes')
const path = require('path')
//config
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)
//server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
