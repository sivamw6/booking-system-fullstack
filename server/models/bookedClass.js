const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const bookedClassSchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true,
  
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const BookedClass = mongoose.model('BookedClass', bookedClassSchema);

function validateBookedClass(bookedClass) {
  const schema = Joi.object({
    timetableId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    date: Joi.string().required(),
  });
  return schema.validate(bookedClass);
}

module.exports.BookedClass = BookedClass;
module.exports.validateBookedClass = validateBookedClass;