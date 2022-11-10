import { makeExecutableSchema } from "@graphql-tools/schema";
import { Router } from "express";
import { graphqlHTTP } from "express-graphql";

import { data } from "../../database/data";
import { resolvers } from "../resolvers/warriors";
import { typeDefs } from "../schemas/types";

export const router = Router();

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

router.use(
  "/graphql",
  graphqlHTTP({
    schema: executableSchema,
    context: data.warriors,
    graphiql: true,
  })
);
