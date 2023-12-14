const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const timetableSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    day: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    time: {
      type: Number,
      min: 0,
      max: 24,
      required: true,
    },
    trainer: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must greater than 0'],
    },
    bookedUsers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }

  }, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

// Define a function that validates timetable input using Joi
function validateTimetable(timetable) {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).required(),
      day: Joi.string().min(3).max(255).required(),
      time: Joi.number().min(0).max(24).required(),
      trainer: Joi.string().min(3).max(255).required(),
      capacity: Joi.number().min(1).required(),
      bookedUsers: Joi.objectId().optional(),
    });
    return schema.validate(timetable);
  }

module.exports.Timetable = Timetable;
module.exports.validateTimetable = validateTimetable;