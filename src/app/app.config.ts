import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import {
  Apollo,
  APOLLO_OPTIONS,
  APOLLO_NAMED_OPTIONS,
} from 'apollo-angular';

import { HttpLink } from 'apollo-angular/http';

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client/core';

import { SetContextLink } from '@apollo/client/link/context';
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

import { routes } from '../app/app.routes';

const GRAPHQL_URI = 'http://localhost:4000/graphql';

export function createDefaultApollo(
  httpLink: HttpLink
): ApolloClient.Options {
  const persistedQueryLink = new PersistedQueryLink({ sha256 });

  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      persistedQueryLink,
      httpLink.create({ uri: GRAPHQL_URI }),
    ]),
  };
}

export function createUserApollo(
  httpLink: HttpLink
): ApolloClient.Options {
  const persistedQueryLink = new PersistedQueryLink({ sha256 });

  const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('token');

  const existing = prevContext.headers instanceof HttpHeaders
    ? prevContext.headers
    : new HttpHeaders(prevContext.headers || {});

  return {
    headers: token
      ? existing.set('Authorization', `Bearer ${token}`)
      : existing,
  };
});

  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      authLink,
      persistedQueryLink,
      httpLink.create({ uri: GRAPHQL_URI }),
    ]),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createDefaultApollo,
      deps: [HttpLink],
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        user: createUserApollo(httpLink),
      }),
      deps: [HttpLink],
    },
  ],
};
