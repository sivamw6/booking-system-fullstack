import { gql } from '@apollo/client';

export const GET_TIMETABLES= gql`
query Timetables {
  timetables {
    id
    title
    day
    time
    trainer
    capacity
    createdAt
    updatedAt
  }
}
`;

export const GET_TIMETABLES_BY_IDS = gql`
  query Timetable($ids: [ID!]!) {
    timetable(ids: $ids) {
      id
      title
      day
      time
      trainer
    }
  }
`;


export const GET_USERS = gql`
query GetUsers {
  getUsers {
    id
    username
    email
    createdAt
    updatedAt
    token
    isAdmin
  }
}
`;

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(id: $userId) {
      id
      username
      email
      createdAt
      updatedAt
      token
      isAdmin
    }
  }
`;

export const GET_BOOKED_CLASSES_BY_USERID = gql`
  query GetBookedClassesByUserId($userId: ID!) {
    getBookedClassesByUserId(userId: $userId) {
      id
      timetableId
      userId
      date
    }
  }
`;