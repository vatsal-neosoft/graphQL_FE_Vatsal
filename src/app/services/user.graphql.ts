import { gql } from 'apollo-angular';
import { USER_FIELDS } from './user.fragments';

export const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(page: $page, limit: $limit) {
      totalCount
      users {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $age: Int) {
    addUser(name: $name, email: $email, age: $age) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!, $age: Int) {
    updateUser(id: $id, name: $name, email: $email, age: $age) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
