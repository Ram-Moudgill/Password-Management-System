const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../Modules/userdata')
const passModel = require('../Modules/password')
if (typeof localStorage === 'undefined' || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./scratch')
}
//middleware
const checkMail = (req, res, next) => {
  const email = req.body.email
  userModel.findOne({ email: email }, (err, data) => {
    if (err) throw err
    if (data) {
      return res.render('signup', {
        title: 'Signup',
        msg: 'This email is already linked with someone account',
      })
    }
  })
  next()
}
const checkUser = (req, res, next) => {
  const username = req.body.username
  userModel.findOne({ username: username }, (err, data) => {
    if (err) throw err
    if (data) {
      return res.render('signup', {
        title: 'create',
        msg: 'username is not avialable',
        userDetail: '',
      })
    }
    next()
  })
}
const checkLogin = (req, res, next) => {
  const checkLogin = localStorage.getItem('user_id')
  if (checkLogin != null) {
    next()
  } else {
    res.redirect('/')
  }
}
const checkLoginForSignin = (req, res, next) => {
  const checkLogin = localStorage.getItem('user_id')
  if (checkLogin == null) {
    next()
  } else {
    res.redirect('/dashboard')
  }
}
//signup get
router.get('/signup', checkLoginForSignin, (req, res) => {
  res.render('signup', { title: 'Signup', msg: '', errors: '' })
})
//signup post
router.post(
  '/signup',
  checkLoginForSignin,
  checkMail,
  checkUser,
  (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirm
    if (password != confirmPassword) {
      res.render('signup', { title: 'Signup', msg: 'Password not matched' })
    } else {
      const newpassword = bcrypt.hashSync(password, 10)
      const newUser = new userModel({
        username: username,
        email: email,
        password: newpassword,
      })
      newUser.save((err, data) => {
        if (err) throw err
        res.redirect('/')
      })
    }
  }
)
//signin get
router.get('/', checkLoginForSignin, (req, res) => {
  res.render('login', { title: 'Login', msg: '' })
})
//signin post
router.post('/', checkLoginForSignin, (req, res) => {
  const username = req.body.username
  const password = req.body.password
  userModel.findOne({ username: username }, (err, data) => {
    if (err) throw err
    if (data != null) {
      if (bcrypt.compareSync(password, data.password)) {
        localStorage.setItem('user_id', data._id)
        localStorage.setItem('user_name', data.username)
        res.redirect('/dashboard')
      } else {
        res.render('login', { title: 'login', msg: 'password not matched' })
      }
    } else {
      res.render('Login', { title: 'login', msg: 'user not found' })
    }
  })
})
//dashboard
router.get('/dashboard', checkLogin, (req, res) => {
  const userid = localStorage.getItem('user_id')
  const username = localStorage.getItem('user_name')
  passModel.find({ userid: userid }, (err, data) => {
    if (err) throw err
    if (data != null) {
      res.render('dashboard', {
        title: 'dashboard',
        data: data,
        username: username,
      })
    } else {
    }
  })
})
//save password route
router.post('/addpassword', checkLogin, (req, res) => {
  const userid = localStorage.getItem('user_id')
  const title = req.body.title
  const passDetail = req.body.passdetail
  const newPassword = new passModel({
    userid: userid,
    title: title,
    password: passDetail,
  })
  newPassword.save((err, data) => {
    if (err) throw err
    res.redirect('/dashboard')
  })
})
//logout
router.get('/logout', (req, res) => {
  localStorage.removeItem('user_id')
  const checkLogin = localStorage.getItem('user_id')
  if (checkLogin == null) {
    res.redirect('/')
  } else {
    console.log(checkLogin)
  }
})
//delete
router.get('/delete/:id', checkLogin, (req, res) => {
  const delId = req.params._id
  passModel.findOneAndRemove({ id: delId }, (err, data) => {
    if (err) throw err
    res.redirect('/dashboard')
  })
})
//update get
router.get('/update/:id', checkLogin, (req, res) => {
  const updateId = req.params.id
  const username = localStorage.getItem('user_name')
  passModel.findOne({ _id: updateId }, (err, data) => {
    if (err) throw err
    res.render('update', { title: 'Update', data: data, username: username })
  })
})
//update post
router.post('/update', checkLogin, (req, res) => {
  const updateId = req.params.id
  passModel.findByIdAndUpdate(
    updateId,
    {
      title: req.body.title,
      password: req.body.password,
    },
    (err, data) => {
      if (err) throw err
      res.redirect('/dashboard')
    }
  )
})

module.exports = router
