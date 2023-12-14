const gql = require('graphql-tag');

const TimetableType = gql`
  type Timetable {
    id: ID!
    title: String!
    day: String!
    time: Int!
    trainer: String!
    capacity: Int!
    createdAt: String!
    updatedAt: String!
  }

  input TimetableInput {
    title: String!
    day: String!
    time: Int!
    trainer: String!
    capacity: Int!
  }

  type TimetableMutationResponse {
    id: ID!
    title: String!
    day: String!
    time: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    timetable(ids: [ID!]!): [Timetable]
    timetables: [Timetable]
    searchTimetables(title: String!): [Timetable]
  }

  type Mutation {
    createTimetable(input: TimetableInput!): Timetable!
    updateTimetable(id: ID!, input: TimetableInput!): Timetable!
    deleteTimetable(id: ID!): Timetable!
  }
`;

module.exports = TimetableType;