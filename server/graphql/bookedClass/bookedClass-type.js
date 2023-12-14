const gql = require('graphql-tag');

const BookedClassType = gql`
  type BookedClass {
    id:ID!
    timetableId: ID!
    userId: ID!
    date: String!
  }

  input BookedClassInput {
    timetableId: ID!
    userId: ID!
    date: String!
  }

  type BookedClassMutationResponse {
    id: ID!
    timetableId: ID!
    userId: ID!
    date: String!
  }

  type Query {
    getBookedClass(id: ID!): BookedClass
    getBookedClasses: [BookedClass]
    getBookedClassesByUserId(userId: ID!): [BookedClass]
  }

  type Mutation {
    createBookedClass(input: BookedClassInput!): BookedClass!
    deleteBookedClass(id: ID!): BookedClass!
  }

`;

module.exports = BookedClassType;