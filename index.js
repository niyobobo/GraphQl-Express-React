const express = require('express');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const schema = buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type Event {
      name: String,
      location: String,
    }

    type RootMutation {
      createEvent(name: String!, location: String!): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)

  class Event {
    constructor(name, location) {
      this.name = name;
      this.location = location;
    }
  }

const root = {
  events: () =>['Coding', 'Singing', 'Dancing'],
  createEvent: (args) => {
    const { name, location } = args;
    return new Event(name, location);
  }
}

app.use('/graphql', graphqlHttp({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`App runs on port ${PORT}`));