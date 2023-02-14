const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });

      if (user) {
         return res.status(400).json({
            ok: false,
            msg: 'There is a user registered with that email already',
         });
      }

      user = new User(req.body);

      // Encript password
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);

      await user.save();

      //Generate JWT
      const token = await generateJWT(user.id, user.name);

      res.status(201).json({
         ok: true,
         msg: 'New user registered correctly',
         uid: user.id,
         name: user.name,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'There was a mistake',
      });
   }
};

const loginUser = async (req, res = response) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({
            ok: false,
            msg: 'There is not a user registered with that email/password',
         });
      }

      //Confirm passwords
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
         return res.status(400).json({
            ok: false,
            msg: 'Incorrect password',
         });
      }

      // Generate JWT
      const token = await generateJWT(user.id, user.name);

      res.json({
         ok: true,
         uid: user.id,
         name: user.name,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'There was a mistake',
      });
   }
};

const renewToken = async (req, res = response) => {
   const uid = req.uid;
   const name = req.name;
   try {
      // Generate new JWT
      const token = await generateJWT(uid, name);
      res.json({
         ok: true,
         uid,
         name,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(400).json({
         ok: false,
         msg: 'Error generating new token',
      });
   }
};

module.exports = { createUser, loginUser, renewToken };
