const express = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateField } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = express.Router();

router.post(
   '/new',
   [
      check('name', 'There must be a name').not().isEmpty(),
      check('email', 'There must be an email').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({
         min: 6,
      }),
      validateField,
   ],
   createUser
);

router.post(
   '/',
   [
      check('email', 'There most be a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({
         min: 6,
      }),
      validateField,
   ],
   loginUser
);

router.get('/renew', validateJWT, renewToken);

module.exports = router;
