const { GraphQLError } = require('graphql');
const Joi = require('joi');
const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');

const { BookedClass, validateBookedClass } = require('../../models/bookedClass');
const { isAuthenticated, isAuthorized, isAdminAuthorized } = require('../../helpers/auth');


const bookedClassResolvers = {
  Query: {
    getBookedClass: async (parent, args) => {
      try {
        const bookedClass = await BookedClass.findById(args.id);
        if (!bookedClass) {
          throw new Error('No booked class found with the given ID.');
        }
        return bookedClass;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getBookedClasses: async () => {
      try {
        return await BookedClass.find();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getBookedClassesByUserId: async (parent, args) => {
      try {
        return await BookedClass.find({ userId: args.userId });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
  
  Mutation: {
    createBookedClass: async (parent, { input }, context) => {
      isAuthenticated(context);

      // Prevent duplicate bookings
      const existingBooking = await BookedClass.findOne({
        timetableId: input.timetableId,
        userId: input.userId,
        date: input.date, 
      });
      if (existingBooking) {
        throw new Error('You have already booked this class.');
      }

      const { error } = validateBookedClass(input);
      if (error) {
        throw new UserInputError('Invalid input data', {
          invalidArgs: input,
        });
      }
      const bookedClass = new BookedClass({
        timetableId: input.timetableId,
        userId: input.userId,
        date: input.date,
      })
      await bookedClass.save();
      return bookedClass;
    },


    deleteBookedClass: async (parent, { id }) => {
      try {
        const deletedBookedClass = await BookedClass.findByIdAndRemove(id);

        if (!deletedBookedClass) {
          throw new Error('No booked class found with the given ID.');
        }

        return deletedBookedClass;
      } catch (error) {
        throw new Error(`Failed to delete booked class: ${error.message}`);
      }
    },
  },
};

module.exports = bookedClassResolvers;
