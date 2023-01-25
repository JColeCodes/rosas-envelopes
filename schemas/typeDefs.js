// Import the gql tagged template function
const { gql } = require('apollo-server-express');

// Create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(username: String!, password: String!): Auth
    }
`;

// Export the typeDefs
module.exports = typeDefs;