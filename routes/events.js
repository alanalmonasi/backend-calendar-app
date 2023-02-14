const express = require('express');
const { check } = require('express-validator');
const {
   getEvent,
   createEvent,
   updateEvent,
   deleteEvent,
} = require('../controllers/events');
const { validateJWT } = require('../middlewares/jwt-validator');
const { validateField } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');
const router = express.Router();

router.use(validateJWT);

router.get('/', getEvent);

router.post(
   '/',
   [
      check('title', 'There must be a title').not().isEmpty(),
      check('start', 'There must be a start date').custom(isDate),
      check('end', 'There must be an end date').custom(isDate),
      validateField,
   ],
   createEvent
);

router.put(
   '/:id',
   [
      check('title', 'There must be a title').not().isEmpty(),
      check('start', 'There must be a start date').custom(isDate),
      check('end', 'There must be an end date').custom(isDate),
      validateField,
   ],
   updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;
