const { response } = require('express');
const Event = require('../models/Event');

const getEvent = async (req, res = response) => {
   const events = await Event.find().populate('user', 'name');
   try {
      res.status(200).json({
         ok: true,
         events,
      });
   } catch (error) {
      console.log(error);
   }
};

const createEvent = async (req, res = response) => {
   const event = new Event(req.body);
   try {
      event.user = req.uid;
      const savedEvent = await event.save();
      res.status(200).json({
         ok: true,
         savedEvent,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'There was an error',
      });
   }
};

const updateEvent = async (req, res = response) => {
   const eventId = req.params.id;
   const uid = req.uid;

   try {
      const event = await Event.findById(eventId);
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Event does not exist',
         });
      }

      if (event.user.toString() !== uid) {
         return res.status(401).json({
            ok: false,
            msg: 'You are not authorized to edit this event',
         });
      }

      const newEvent = {
         ...req.body,
         user: uid,
      };

      const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
         new: true,
      });

      res.status(200).json({
         ok: true,
         msg: 'Event updated succesfully',
         event: updatedEvent,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'There was an error while proccesing your request',
      });
   }
};

const deleteEvent = async (req, res = response) => {
   const eventId = req.params.id;
   const uid = req.uid;

   try {
      const event = await Event.findById(eventId);
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Event does not exist',
         });
      }

      if (event.user.toString() !== uid) {
         return res.status(401).json({
            ok: false,
            msg: 'You are no authorized to delete this event',
         });
      }

      await Event.findByIdAndDelete(eventId);

      res.status(200).json({
         ok: true,
         msg: 'Event deleted succesfully',
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'There was an error while proccesing your request',
      });
   }
};

module.exports = {
   getEvent,
   createEvent,
   updateEvent,
   deleteEvent,
};
