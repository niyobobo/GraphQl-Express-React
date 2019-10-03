const express = require('express');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');

const app = express();
const PORT = process.env.PORT || 3000;

const events = [];

app.use(express.json());

const schema = buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(input: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)

class Event {
  constructor({title, description, price}) {
    this._id = Math.random().toString();
    this.title = title;
    this.description = description;
    this.price = price;
    this.date = new Date().toISOString();
  }
}

const root = {
  events: () => events,
  createEvent: (args) => {
    const event = new Event(args.input);
    events.push(event);
    return event;
  }
}

app.use('/graphql', graphqlHttp({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`App runs on port ${PORT}`));