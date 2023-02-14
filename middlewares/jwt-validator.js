const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
   //Se envía en los headers
   const token = req.header('x-token');
   if (!token) {
      return res.status(401).json({
         ok: false,
         msg: 'No token found',
      });
   }

   try {
      const payload = jwt.verify(token, process.env.SECRET_JWT);
      req.uid = payload.uid;
      req.name = payload.name;
   } catch (error) {
      console.log(error);
      return res.status(401).json({
         ok: false,
         msg: 'Invalid token',
      });
   }
   next();
};

module.exports = {
   validateJWT,
};
