import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { gql } from 'apollo-boost';

import App from './App';
import { token } from './config/graphql';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

client
  .query({
    query: gql`
      {
        repository(owner: "facebook", name: "react") {
          id
          nameWithOwner
          description
          owner {
            login
            avatarUrl
          }
        }
      }
    `,
  })
  .then((result) => console.log('connected Github API', result));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
