import { gql } from 'apollo-angular';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    age
  }
`;
