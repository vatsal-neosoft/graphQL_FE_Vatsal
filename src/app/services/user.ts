import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
} from './user.graphql';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersQuery!: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  initUsers(page: number, limit: number) {
    this.usersQuery = this.apollo.use('default').watchQuery({
      query: GET_USERS,
      variables: { page, limit },
      fetchPolicy: 'cache-and-network',
    });

    return this.usersQuery.valueChanges;
  }

  refetchUsers(page: number, limit: number) {
    this.usersQuery?.refetch({ page, limit });
  }

  addUser(user: any) {
    return this.apollo.use('user').mutate({
      mutation: ADD_USER,
      variables: user,
    });
  }

  updateUser(user: any) {
    return this.apollo.use('user').mutate({
      mutation: UPDATE_USER,
      variables: user,
    });
  }

  deleteUser(id: string) {
    return this.apollo.use('user').mutate({
      mutation: DELETE_USER,
      variables: { id },
    });
  }
}
