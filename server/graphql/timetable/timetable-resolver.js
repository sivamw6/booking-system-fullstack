// Import necessary modules and models
const { GraphQLError } = require('graphql');
const { ApolloError, AuthenticationError, UserInputError } = require('apollo-server');

const { Timetable, validateTimetable } = require('../../models/timetable');
const { isAuthenticated, isAuthorized, isAdminAuthorized } = require('../../helpers/auth');

// Define the TimetableResolver object, which contains resolvers for the TimetableType, Query, and Mutation types
const timetableResolver = {
  Query: {
    timetable: async (parent, args) => {
      try {
        // Extract the IDs from the arguments
        const { ids } = args; 
    
        // Find the timetables by their IDs
        const uniqueIds = [...new Set(ids)]; // Remove duplicates for querying
        const timetableRecords = await Timetable.find({
          '_id': { $in: uniqueIds }
        });
    
        if (!timetableRecords) {
          throw new UserInputError('Cannot find the timetables', {
            invalidArgs: args,
          });
        }
    
        // Map the original list of IDs to the retrieved timetable records
        const timetables = ids.map(id => {
          return timetableRecords.find(record => record._id.toString() === id) || null;
        });
    
        console.log("timetables:", timetables);
    
        // Return the manually constructed list of timetables, respecting duplicates
        return timetables;
      } catch (error) {
        console.log("An error occurred:", error); // Log the error details to the console
        throw new ApolloError('Failed to load timetable data', 'TIMETABLE_DATA_ERROR');
      }
    },
        timetables: async () => {
      try {
        // Find all timetable 
        return await Timetable.find();
      } catch (error) {
        throw new ApolloError('Failed to load timetable data', 'TIMETABLE_DATA_ERROR');
      }
    },
    searchTimetables: async (parent, args) => {
      try {
        // Find all timetable that match the title provided in the query arguments
        return await Timetable.find({ title: new RegExp('^' + args.title + '$', 'i') });
      } catch (error) {
        throw new ApolloError('Failed to load timetable data', 'TIMETABLE_DATA_ERROR');
      }
    },
  },
  Mutation: {
    createTimetable: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        // Check if the user is authorized (isAdmin is true)
        console.log("User object in createTimetable:", context.user)



        // Validate the input data using the validateTimetable function
        const { error } = validateTimetable(args.input);
        if (error) {
          throw new UserInputError('Invalid input data', { validationErrors: error.details });
        }

        // Create a new timetable using the input data
        const timetable = new Timetable({
          title: args.input.title,
          day: args.input.day,
          time: args.input.time,
          trainer: args.input.trainer,
          capacity: args.input.capacity,
        });


        // Save the new timetable ery to the database
        await timetable.save();

        // Return the new timetable enry
        return timetable;
      } catch (error) {
        if (error instanceof ApolloError) {
          throw error;
        } else {
          throw new GraphQLError(error, {
            extensions: {
              code: 'CREATE_TIMETABLE_ERROR',
            },
          });
        }
      }
    },
    deleteTimetable: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the timetable by its ID
        const timetable = await Timetable.findById(args.id);
        if (!timetable) {
          throw new UserInputError('Invalid input data', {
            invalidArgs: args.input,
          });
        }

        if(context.user.id === args.id) {
          isAuthorized(args.id, context);
        } else {
          isAdminAuthorized(context);
        }

        // Delete the timetable
        const deletedTimetable = await Timetable.findByIdAndDelete(args.id);

        // Return the deleted timetable data
        return deletedTimetable;
      } catch (error) {
        console.error("An error occurred:", error); // 输出错误详情到控制台

        // 判断错误类型并相应处理
        if (error instanceof ApolloError) {
          throw error; // 如果是 ApolloError，直接抛出
        } else {
          // 对于其他类型的错误，您可以创建一个 ApolloError 实例，这样可以添加更多上下文信息
          throw new ApolloError(error.message, 'CREATE_TIMETABLE_ERROR', {
            // 在 extensions 字段中，您可以添加任何希望传递的额外信息
            additionalInfo: 'Additional context or information here',
            originalError: error, // 如果需要，甚至可以传递原始错误对象
          });
        }
      }
    },
    updateTimetable: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);

        const timetable = await Timetable.findById(args.id);

        if(!timetable) {
          throw new Error('Timetable not found')
        }

        if (context.user.id === args.id) {
          isAuthorized(args.id, context);
        } else {
          isAdminAuthorized(context);
        }



        // Validate the input data using the validateTimetable function
        const { error } = validateTimetable(args.input);
        if (error) {
          throw new UserInputError('Invalid input data', { validationErrors: error.details });
        }

        // Update the timetable with the validated input data
        const updatedTimetable = await Timetable.findByIdAndUpdate(args.id, args.input, { new: true });

        // Return the updated timetable data
        return updatedTimetable;
      } catch (error) {
        throw new ApolloError('Failed to update timetable', 'UPDATE_TIMETABLE_ERROR', { error });
       }
    },
  },
};


module.exports = timetableResolver;
