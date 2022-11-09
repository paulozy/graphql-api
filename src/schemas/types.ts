export const typeDefs = `
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
