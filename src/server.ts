import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import express, { Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";

const app = express();

const data = {
  warriors: [
    {
      id: 1,
      name: "Naruto",
      weapon: "Rasengan",
    },
    {
      id: 2,
      name: "Sasuke",
      weapon: "Chidori",
    },
    {
      id: 3,
      name: "Sakura",
      weapon: "Health",
    },
    {
      id: 4,
      name: "Kakashi",
      weapon: "Sharingan",
    },
  ],
};

const typeDefs = `
  type Warrior {
    id: ID!
    name: String!
    weapon: String!
  }

  type WarriorsConnection {
    edges: [Warrior!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String!
    endCursor: String!
  }

  type Query {
    warriors: [Warrior!]!
    warrior(id: ID!): Warrior!
    warriorsConnection(
      after: String
      before: String
      first: Int
      last: Int
    ): WarriorsConnection!
  }
`;

const resolvers = {
  Query: {
    warriors: (obj: any, args: any, context: any, info: any) =>
      context.warriors,
    warrior: (obj: any, args: any, context: any, info: any) => {
      const { id } = args;

      const warrior = context.warriors.filter(
        (warrior: any) => warrior.id === Number(id)
      )[0];

      return warrior;
    },
    warriorsConnection: (obj: any, args: any, context: any, info: any) => {
      const { after, before, first, last } = args;

      let edges: any[] = [];
      let pageInfo: any = {};

      if (first) {
        edges = context.warriors.slice(0, first);

        pageInfo = {
          hasNextPage: context.warriors.length > first,
          hasPreviousPage: false,
          startCursor: edges[0].id,
          endCursor: edges[edges.length - 1].id,
        };

        if (after) {
          edges = context.warriors.slice(
            context.warriors.findIndex(
              (warrior: any) => warrior.id === Number(after)
            ) + 1,
            context.warriors.findIndex(
              (warrior: any) => warrior.id === Number(after)
            ) +
              1 +
              first
          );

          pageInfo = {
            hasNextPage: edges.length > first,
            hasPreviousPage: true,
            startCursor: edges[0].id,
            endCursor: edges[edges.length - 1].id,
          };
        }
      }

      if (last) {
        edges = context.warriors.slice(
          context.warriors.length - last,
          context.warriors.length
        );

        pageInfo = {
          hasNextPage: false,
          hasPreviousPage: context.warriors.length > last,
          startCursor: edges[0].id,
          endCursor: edges[edges.length - 1].id,
        };

        if (before) {
          edges = context.warriors.slice(
            context.warriors.findIndex(
              (warrior: any) => warrior.id === Number(before)
            ) - last,
            context.warriors.findIndex(
              (warrior: any) => warrior.id === Number(before)
            )
          );

          pageInfo = {
            hasNextPage: true,
            hasPreviousPage: edges.length > last,
            startCursor: edges[0].id,
            endCursor: edges[edges.length - 1].id,
          };
        }
      }

      return {
        edges,
        pageInfo,
      };
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: executableSchema,
    context: data,
    graphiql: true,
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
