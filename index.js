const express = require('express');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/events').default.default;

const app = express();
const PORT = process.env.PORT || 3000;

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
  `);

const root = {
  events: () => {
    return Event.find().then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id
        }
      });
    }).catch(err => {
      throw err;
    })
  },
  createEvent: (args) => {
    const event = new Event({
      ...args.input,
      date: new Date(new Date().toISOString()),
    });
    return event.save()
      .then(result => {
        return {
          ...result._doc,
          _id: result._doc._id.toString()
        }
      })
      .catch(err => {
        throw err;
      });
  }
}

app.use('/graphql', graphqlHttp({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const URI = `mongodb+srv://${process.env.MONGO_USER}:${
              process.env.MONGO_PASS}@cluster0-jrk3z.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`App runs on port ${PORT}`));
}).catch(err => console.log(err));