const express = require('express')

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');


const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const users = await User.findAll({
      attributes:['email','username']
    })

    try {
      const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName
      });


      const safeUser = {
        firstName,
        lastName,
        id: user.id,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.status(201).json({
        user: safeUser
      });


    } catch (error) {
      const { username, email } = req.body
      for (const user of users) {
        if (username === user.username || email=== user.email) {
          const err = new Error()
           err.errors = {}
          if (username === user.username){
            err.errors.username = "User with that username already exists"
          }
          if (email === user.email){
          err.errors.email =  "User with that email already exists"
          }
          err.message = "User already exists"
          err.status = 500
          return next(err)
        }
      }
      error.message = "Bad request"
      error.status = 400
      return next(error)
    }

   }
);


module.exports = router