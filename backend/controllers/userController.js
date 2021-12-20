const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const auth = require('../middlewares/auth')
const models = require('../models')
const User = models.User


/* GET ALL USERS */
exports.getAllUsers = (req, res) => {
  User.findAll()
    .then(users => {
      res.status(200).json({ users })
    })
    .catch(err => res.status(500).json({ err }))
}

/* SIGNUP */
exports.signup = (req, res, next) => {
  bcrypt /* hashage du mots de passe - Promise */
    .hash(req.body.password, 10)
    .then(hash => {
      const newUser = User.create({
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isAdmin: false
      })
        .then(user => {
          res.json(user)
        })
        .catch(err => {
          res.status(500).json({ err })
        })
    })
}
/* LOGIN */
exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  /* Check la presence de l'email et pass */
  if (!email || !password) {
    res.status(400).json({ error: 'Paramétre(s) manquant(s)' })
  }

  User.findOne({ where: { email: email } })
    .then(user => {
      /* Check si le user a ete trouvé */
      if (!user || user == null) {
        res.status(400).json({ error: 'Email non valide' })
      }
      bcrypt
        .compare(password, user.password)
        .then(validation => {
          console.log(validation) /* TESTING ! */
          if (validation != true) {
            return res.status(401).json({ error: 'Mot de passe incorrect' })
          }

          res.status(200).json({
            /* Voir avec le FRONT pour savoir qui en faire (envoyer dans le header des req et/ou params) */
            token: jwt.sign({ userId: user._id }, process.env.ILOVESALT, {
              expiresIn: '24h'
            })
          })
        })
        .catch(error => res.status(500).json({ error: 'A' }))
    })
    .catch(error => res.status(500).json({ error: 'B' }))
}

/* UPDATE PROFIL */
exports.updateUserProfil = (req, res, next) => {
  newUserDatas = { ...req.body }
  const user = User.findByPk(req.params.id)  
  /* RECUPERERA L'ID DU USER DANS LE HEADER DE LA REQUêTE a l'avenir (a voir avec Raoul) */
  .then(user => {
  user.set(

    { firstName: req.body.firstName },
    { lastName: req.body.lastName },
    { nickname: req.body.nickname },
    { bio: req.body.bio },

    /*       newUserDatas  <<==== Utilisable a la place de toutes les lignes ci dessus ? */
  )
    .then(user => {
      user.save()
    })})
    .then(user => {
      res.status(200).json({ user })
    })
    .catch(err => {
      res.json({ error: err })
    })
 /* -------------------------------- */
/*  const user = User.findByPk(req.body.id)  
    if (req.file) {
    const imageToDelete = user.profilImageUrl.split('/user_upload/profil_images')[1]
    fs.unlink('user_upload/profil_images' + imageToDelete, function(){})
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    user.set(
      { where: req.body.id },
      { firstName: req.body.firstName },
      { lastName: req.body.lastName },
      { nickname: req.body.nickname },
      { bio: req.body.bio },
      { birthday: req.body.birthday },
      { profilImageUrl: }
    )} else {
      user.set
    }
      .then(user => {
        user.save()
      })
      .then(user => {
        res.status(200).json({ user })
      })
      .catch(err => {
        res.json({ err })
      })
   */

   /* -------------------------------- */
/* const user = User.findByPk(req.body.id) */



}

/* FIND ONE BY ID */
exports.getOneUser = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => {
      res.json({ user })
    })
    .catch(err => {
      res.json({ error: 'Request getOneUser have an issue ' + err })
    })
}
/* FIND ONE BY EMAIL
 ** Changer le req.body en req.params pour tester facilement ***/
exports.findByEmail = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } }).then(user => {
    res.json({ user }).catch(err => {
      res.json({ error: 'Request findByEmail have an issue ' + err })
    })
  })
}

/* FIND BY NAME */
exports.findByName = (req, res) => {
  User.findOne({ where: { firstName: req.params.firstName } }).then(user => {
    res
      .status(200)
      .json({ user })
      .catch(err => {
        res.json({ error: 'Request findByName have an issue ' + err })
      })
  })
}