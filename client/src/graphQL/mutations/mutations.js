import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
mutation Login($input: LoginInput!) {
  loginUser(input: $input) {
    createdAt
    email
    id
    isAdmin
    token
    username
  }
}
`;
export const CREATE_USER = gql`
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    createdAt
    token
  }
}
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      email
      isAdmin
    }
  }

`;
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
      email
      isAdmin
    }
  }
`;


export const CREATE_TIMETABLE = gql`
mutation CreateTimetable($input: TimetableInput!) {
  createTimetable(input: $input) {
    id
    title
    day
    time
    trainer
    capacity
  }
}
`;

export const UPDATE_TIMETABLE = gql`
  mutation UpdateTimetable($id: ID!, $input: TimetableInput!) {
    updateTimetable(id: $id, input: $input) {
      id
      title
      day
      time
      trainer
      capacity
    }
  }
`;

export const DELETE_TIMETABLE = gql`
  mutation DeleteTimetable($id: ID!) {
    deleteTimetable(id: $id) {
      id
      title
      day
      time
      trainer
      capacity
    }
  }
`;

export const CREATE_BOOKEDCLASS = gql`
  mutation CreateBookedClass($input: BookedClassInput!) {
    createBookedClass(input: $input) {
      id
      timetableId
      userId
      date
    }
  }
`