// Import necessary modules
const { GraphQLError } = require('graphql');
const Joi = require('joi');
const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');

const { User, validateUser, validateUserForUpdate } = require('../../models/user');
const { isAuthenticated, isAuthorized, isAdminAuthorized } = require('../../helpers/auth');

// Define the resolvers for the User type
const resolvers = {
  Query: {
    getUser: async (parent, args, context) => {
      try {
        //In Apollo Server, the context object is a way to share data between resolvers.  
        //It is an object that is passed to every resolver function, and can be used to store data that is needed by multiple resolvers.
        //The context object is typically used to store information about the current user, such as their authentication status or user ID. This information can then be used by resolvers to determine whether the user is authorized to perform certain actions.

        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the user with the given ID
        const user = await User.findById(args.id);
        // If the user doesn't exist, throw an Error
        if (!user) {
          throw new Error('User not found')
        }

        // Check if the user is authorized to get the user
        if (context.user.id === args.id || context.user.isAdmin) {
          return user;
        }
        // Return the user data
        return user;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_USER_ERROR',
          },
        });
      }
    },
    getUsers: async () => {
      try {
        // Find all users in the database
        const users = await User.find();
        return users;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'GET_USERS_ERROR',
          },
        });
      }
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      try {
        // Validate the input data using a Joi schema
        const { error, value } = validateUser(args.input);
        // If the input data is invalid, throw an Error
        if (error) {
          throw new Error(`Invalid User input ${error}`)
        }
        

        // Create a new user with the validated input data
        const user = new User(value);
        await user.save();

        // Generate an auth token for the new user
        const token = user.generateAuthToken();

        // Pick only the necessary user data and add the auth token
        let userData = _.pick(user, ['id', 'username', 'email', 'createdAt']);
        userData.token = token;
        userData.isAdmin = false;

        // Return the user data with the auth token
        return userData;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'CREATE_USER_ERROR',
          },
        });
      }
    },
    loginUser: async (parent, args) => {
      try {
        // Validate the login input data using a Joi schema
        const loginSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        });
        const { error, value } = loginSchema.validate(args.input);
        // If the input data is invalid, throw an Error
        if (error) {
          throw new Error(`Invalid User input ${error}`)
        }

        // Find the user with the given email
        const user = await User.findOne({ email: value.email });
        // If the user doesn't exist, throw an Error
        if (!user) {
          throw new Error('Invalid email or password')
        }
        // Check if the password is correct
        const validPassword = await user.comparePassword(value.password, user.password)
        // If the password is incorrect, throw an Error
        if (!validPassword) {
          throw new Error('Invalid email or password')
        }

        // Generate an auth token for the user
        const token = user.generateAuthToken();

        // Pick only the necessary user data and add the auth token
        let userData = _.pick(user, ['id', 'username', 'email', 'createdAt', 'isAdmin']);
        userData.token = token;

        // Return the user data with the auth token
        return userData;
      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'LOGIN_USER_ERROR',
          },
        });
      }
    },
    updateUser: async (parent, args, context) => {
      try {
        // Check if the user is authenticated
        isAuthenticated(context);
    
        // Find the user with the given ID
        const user = await User.findById(args.id);
        // If the user doesn't exist, throw an Error
        if (!user) {
          throw new Error('User not found');
        }
    
        // Validate the input data using a Joi schema
        const { error, value } = validateUserForUpdate(args.input);
        // If the input data is invalid, throw an Error
        if (error) {
          throw new Error(`Invalid User input: ${error}`);
        }
    


        // Here we check if the user is trying to update their own record or if they are an admin
        if (context.user._id === args.id || context.user.isAdmin) {
          // If they are authorized, we update the user with the validated input data
          const updatedUser = await User.findByIdAndUpdate(args.id, value, { new: true });
          

    
          // Return the updated user data
          return updatedUser;
        } else {
          // If they are not authorized, we throw an error
          throw new Error('Not authorized to update this user data');
        }
      } catch (error) {
        // Handle errors by throwing an ApolloError with a specific code
        throw new ApolloError(`Failed to update user: ${error.message}`, 'UPDATE_USER_ERROR');
      }
    },
                deleteUser: async (parent, args, context) => {
      try {

        // Check if the user is authenticated
        isAuthenticated(context);

        // Find the user with the given ID
        const user = await User.findById(args.id);
        // If the user doesn't exist, throw an Error
        if (!user) {
          throw new Error('User not found')
        }

        // Check if the user is authorized to delete the user
        if(context.user.id === args.id) {
          isAuthorized(args.id, context);
        } else {
          isAdminAuthorized(context);
        }
        // Delete the user
        const deletedUser = await User.findByIdAndDelete(args.id);

        // Return the deleted user data
        return deletedUser;

      } catch (error) {
        // If there was an error, throw an ApolloError with a custom error code
        throw new GraphQLError(error, {
          extensions: {
            code: 'DELETE_USER_ERROR',
          },
        });
      }
    },
  },
};



// Export the resolvers
module.exports = resolvers;